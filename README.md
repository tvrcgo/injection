# injection
An IoC toolkit

## Usage

### Inject metadata

```js
import { injectable, inject } from '@tvrcgo/injection'

// lib/logger.ts
@injectable('logger')
export class Logger {
  info() {}

  @inject('oss')
  sender
}

// lib/oss.ts
@injectable('oss')
export class OSS {
  put() {}
}
```

### Container

```js
import { Container } from '@tvrcgo/injection'

const container = new Container()
container.load(['dist/lib/**'])

const logger = container.use('logger')
logger.info()
logger.sender.put()
```
