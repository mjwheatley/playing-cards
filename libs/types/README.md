# @nx-monorepo-template/types

:information_source: This package exports shared TypeScript types, Zod schemas, and type predicate or assertion functions.

## :thumbsup: What belongs in this package?

- General purpose types and schemas that can be used in _any_ lib or app
- Shared data models that are needed on the back-end and front-end
- Other functionality related to types in this package, such as type predicate functions

## :thumbsdown: What does not belong in this package?

- Barrel files

  You should use the full import path to the thing you want instead of importing a file that re-exports everything.

- Types and schemas that are only used by one system

  For example, the type and schema for an SQS handler event should be in the `billing` service, not this lib.

## User Guide

- Add `@nx-monorepo-template/types` to your lib or app `package.json`.

  ```json
  {
    "dependencies": {
      "@nx-monorepo-template/types": "workspace:*"
    }
  }
  ```

- Use the full path of the thing you want when importing.

  Example:

  ```ts
  import { ErrorResponseSchema } from '@nx-monorepo-template/types/models/errors';
  ```
