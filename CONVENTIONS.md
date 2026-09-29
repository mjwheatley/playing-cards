# Coding Conventions

This document defines coding style conventions for this monorepo. These conventions apply to all contributors, whether human or AI-assisted.

## Function Declarations

**Prefer arrow functions assigned to constants** over traditional function declarations.

✅ **Preferred:**

```typescript
export const fetchUserProfile = async ({
  userId,
  includeDetails,
}: FetchUserProfileParams): Promise<UserProfileResult> => {
  // implementation
};

const calculateTotalPrice = (products: Product[]): number => {
  return products.reduce((sum, product) => sum + product.price, 0);
};
```

❌ **Avoid:**

```typescript
export async function fetchUserProfile({ userId, includeDetails }: FetchUserProfileParams): Promise<UserProfileResult> {
  // implementation
}

function calculateTotalPrice(products: Product[]): number {
  return products.reduce((sum, product) => sum + product.price, 0);
}
```

**Exception:** React components may use either style but maintain consistency within a file.

## Function Parameters

### Prefer `Params` Objects

**Always use a params object** instead of comma-separated parameters, even for single parameters. This improves API evolution and makes function calls more readable.

✅ **Preferred:**

```typescript
// Define explicit type for params
type FetchUserProfileParams = {
  userId: string;
  includeDetails?: boolean;
};

// Use destructuring with explicit type
export const fetchUserProfile = async ({
  userId,
  includeDetails = false,
}: FetchUserProfileParams): Promise<UserProfile> => {
  // implementation
};

// Even for single parameter
type CalculateDiscountParams = {
  price: number;
};

export const calculateDiscount = ({ price }: CalculateDiscountParams): number => {
  return price * 0.1;
};

// Usage is self-documenting
// noinspection JSAnnotator
const userProfile = await fetchUserProfile({
  userId: 'user-123',
  includeDetails: true,
});
```

❌ **Avoid:**

```typescript
// Don't use comma-separated parameters
export const fetchUserProfile = async (userId: string, includeDetails?: boolean): Promise<UserProfile> => {
  // implementation
};
```

```typescript
// Don't use inline types
export const fetchUserProfile = async ({ userId }: { userId: string }): Promise<UserProfile> => {
  // implementation
};

// Usage is less clear
const userProfile = await fetchUserProfile('user-123', true);
```

### Params Object Benefits

**Readability:** Named parameters at the call site make code self-documenting

```typescript
// ✅ Clear what each argument means
createOrder({ quantity: 2, productId: 'prod-001', userId: 'user-123' });

// ❌ Hard to understand without reading function signature
createOrder(2, 'prod-001', 'user-123');
```

**Evolution:** Easy to add optional parameters without breaking existing calls

```typescript
type CreateOrderParams = {
  quantity: number;
  productId: string;
  userId: string;
  notes?: string; // Added later without breaking changes
};
```

**Refactoring:** Parameter order doesn't matter

```typescript
// Both work the same
createOrder({ quantity: 2, userId: 'user-123', productId: 'prod-001' });
createOrder({ userId: 'user-123', productId: 'prod-001', quantity: 2 });
```

### Params Type Naming

Name params types based on the function name:

- `{functionName}Params` for parameters
- `{functionName}Result` or `{functionName}Output` for return types

```typescript
type FetchProductParams = {
  productId: string;
};

type FetchProductResult = {
  product: Product;
  supplier: Supplier;
};

export const fetchProduct = async (params: FetchProductParams): Promise<FetchProductResult> => {
  // implementation
};
```

### When to Use Non-Destructured Params

Use the non-destructured `params` pattern when:

1. You need to pass the entire params object to another function
2. You have many optional parameters
3. You want to validate the entire params object

```typescript
type ProcessOrderParams = {
  quantity: number;
  productId: string;
  userId: string;
  shippingMethodId: string;
  notes?: string;
};

// Non-destructured when passing along
export const processOrder = async (params: ProcessOrderParams): Promise<Order> => {
  validateOrderParams(params); // Validate entire object
  return await orderClient.createOrder(params); // Pass entire object
};

// Destructured for simple operations
export const calculateOrderDiscount = ({ quantity, productId }: CalculateOrderDiscountParams): number => {
  return quantity > 10 ? 0.15 : 0.05;
};
```

### Exceptions

**Callback functions and array methods** may use positional parameters when the context is clear:

```typescript
// ✅ Acceptable - standard callback signatures
products.forEach((product, index) => {
  /* ... */
});
promise.then((result) => {
  /* ... */
});
promise.catch((error) => {
  /* ... */
});

// ✅ Acceptable - very simple utility functions
const add = (a: number, b: number): number => a + b;
const isPositive = (value: number): boolean => value > 0;
```

**React event handlers** follow React conventions:

```typescript
// ✅ Acceptable - React conventions
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  // implementation
};
```

## Variable Naming

### Descriptive Names Required

Use **complete, descriptive variable names**. Avoid single-letter or abbreviated names, **including in inline callbacks and arrow functions**.

✅ **Preferred:**

```typescript
// Regular variables
const adjustment = calculateAdjustment();
const shippingFee = getShippingFee();
const totalPrice = subtotal + adjustment + shippingFee;

// Inline callbacks - use descriptive names
const user = users.find((user) => user.id === userId);
const availableProducts = products.filter((product) => product.isAvailable);
const productIds = orders.map((order) => order.productId);
const sortedProducts = products.sort((productA, productB) => productA.price - productB.price);

// Destructuring - use descriptive names
const { orderDetails, canReorder } = await fetchOrderData(userId);
```

❌ **Avoid:**

```typescript
// Abbreviated variables
const adj = calculateAdjustment(); // ❌ abbreviated
const sf = getShippingFee(); // ❌ abbreviated
const amt = subtotal + adj + sf; // ❌ abbreviated

// Single letters in callbacks
const user = users.find((u) => u.id === userId); // ❌ single letter
const availableProducts = products.filter((p) => p.isAvailable); // ❌ single letter
const productIds = orders.map((o) => o.productId); // ❌ single letter
const sortedProducts = products.sort((a, b) => a.price - b.price); // ❌ single letters

// Vague or unclear names
const data = fetchUserInfo(); // ❌ too generic
const temp = products[0]; // ❌ unclear purpose
const result = process(input); // ❌ not descriptive
```

### Allowed Exceptions

These are the **only** acceptable short variable names:

1. **Unused parameters**: Prefix with underscore

   ```typescript
   const productIds = orders.map((_order, index) => index);
   const handler = (_event, context) => {
     /* only use context */
   };
   ```

2. **Well-known domain abbreviations**:
   - `id` (identifier)
   - `url` (uniform resource locator)
   - `uri` (uniform resource identifier)
   - `html`, `css`, `json`, `xml`
   - `api` (application programming interface)
   - `aws` (Amazon Web Services)
   - `sst` (Serverless Stack)

3. **Traditional loop counters** (in for-loops only, prefer `forEach`/`map` when possible):

   ```typescript
   // Acceptable in traditional for-loops
   for (let i = 0; i < products.length; i++) {
     console.log(products[i]);
   }

   // But prefer descriptive names with array methods
   products.forEach((product, index) => {
     console.log(product);
   });
   ```

### Naming Patterns by Type

**Boolean variables**: Use `is`, `has`, `can`, `should` prefixes

```typescript
const isAvailable = product.status === 'available';
const hasDiscount = !!product.discountId;
const canReorder = checkReorderEligibility();
const shouldRetry = attempt < maxAttempts;
```

**Arrays/Collections**: Use plural names

```typescript
const products = await fetchProducts();
const userIds = users.map((user) => user.id);
const availableOrders = orders.filter((order) => order.isAvailable);
```

**Functions/Methods**: Use verb-noun pairs

```typescript
const calculateTotalPrice = (products: Product[]) => {
  /* ... */
};
const fetchProductDetails = async (id: string) => {
  /* ... */
};
const validateOrder = (order: Order) => {
  /* ... */
};
```

## TypeScript Style

### Type Imports

Use `import type` for type-only imports:

```typescript
import type { Product } from '@acme/common-types';
import { fetchProduct } from '@server/services';
```

### Type Assertions

Prefer `as` over angle brackets:

```typescript
const product = data as Product; // ✅ Preferred
```

```typescript
const product = <Product>data; // ❌ Avoid
```

### Return Types

Always specify explicit return types on functions:

```typescript
const calculateDiscount = (price: number): number => {
  // ✅ Has return type
  return price * 0.1;
};
```

## Import Ordering

Imports are automatically organized by ESLint (alphabetical, grouped):

```typescript
// 1. Node built-ins (with node: protocol)
import { readFile } from 'node:fs/promises';

// 2. External packages
import { z } from 'zod';

// 3. Internal packages (@acme/*)
import type { Product } from '@acme/common-types';
import { logger } from '@acme/node-logger';

// 4. Relative imports
import { getOrderClient } from './utils/order-client';

// 5. Type imports (grouped separately)
import type { GetProductByIdOutput } from '@schemas/productRoutes';
```

## Code Formatting

### Blank Lines

Enforced by ESLint – blank lines required:

- Before `return` statements
- Before `throw` statements
- Before `if` statements
- After `if` blocks
- Between variable declarations and other statements

```typescript
const calculateTotalPrice = (products: Product[]): number => {
  const subtotal = products.reduce((sum, product) => sum + product.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (total < 0) {
    throw new Error('Total cannot be negative');
  }

  return total;
};
```

### Const vs Let

- Use `const` by default (enforced by ESLint)
- Only use `let` when reassignment is necessary
- Never use `var`

```typescript
const userId = '123'; // ✅ Won't change
let attemptCount = 0; // ✅ Will be incremented
attemptCount += 1;
```

## Comments and Documentation

### When to Comment

- Complex business logic that isn't self-evident
- Non-obvious workarounds or edge cases
- Safety-critical sections (data integrity, authentication)
- References to external tickets or specs

```typescript
// Only allow reorder if the previous order is COMPLETED
// and belongs to the currently active user.
// See: [TICKET-123] for context on why this check is needed.
if (previousOrder.status === OrderStatus.COMPLETED) {
  const activeUser = await userClient.getActiveUser(userId);
  canReorder = activeUser?._id === previousOrderId;
}
```

### When NOT to Comment

- Don't leave comments on obvious code
- Don't leave commented-out code (use git history)

## Testing Conventions

- Test files colocated with the source file: `file.ts` → `file.test.ts`
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

```typescript
describe('calculateShippingFee', () => {
  it('should calculate 10% shipping fee for valid subtotal', () => {
    // Arrange
    const subtotal = 100;

    // Act
    const shippingFee = calculateShippingFee(subtotal);

    // Assert
    expect(shippingFee).toBe(10);
  });
});
```

## Prohibited Patterns

### Avoid These Imports

```typescript
import _ from 'lodash'; // ❌ Avoid lodash (use native JS)
import * as yup from 'yup'; // ❌ Use Zod instead
import util from '../..'; // ❌ Use full paths
```

### Avoid Magic Numbers

```typescript
// ❌ Bad
if (product.price > 10000) {
  /* ... */
}

// ✅ Good
const HIGH_PRICE_THRESHOLD = 10000;

if (product.price > HIGH_PRICE_THRESHOLD) {
  /* ... */
}
```

### Avoid Deeply Nested Logic

```typescript
// ❌ Avoid deep nesting
if (user) {
  if (user.order) {
    if (user.order.isActive) {
      // ...
    }
  }
}

// ✅ Use early returns
if (!user) {
  return null;
}

if (!user.order) {
  return null;
}

if (!user.order.isActive) {
  return null;
}
// ...
```

## Enforcement

These conventions are enforced through:

- **ESLint**: Automated linting (see `.eslintrc.json`)
  - `max-params: 4` warns when functions exceed four parameters (use a params object instead)
  - `id-length` enforces minimum 2-character variable names
  - `@typescript-eslint/explicit-function-return-type` requires return types
  - Import ordering, padding lines, and more
- **Prettier**: Code formatting
- **TypeScript**: Type checking and strict mode
- **Pre-commit hooks**: Prevent non-compliant code from being committed
- **Code review**: Human and AI reviewers validate adherence

**Note:** The `max-params` rule will warn at 4+ parameters, but this codebase prefers params objects even for 1–3 parameters for consistency and future-proofing.
