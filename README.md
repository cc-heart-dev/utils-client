# utils-client

A collection of tools commonly used by browsers(eg. http-request)

## Usage

```shell
pnpm add @cc-heart/utils-client
```

### Scss Usage

create a new scss file (e.g. `lib.scss`), and write following content:

```scss
@use '@cc-heart/utils-client/scss/function.scss' as *;
@use '@cc-heart/utils-client/scss/mixins.scss' as *;

$namespace: cc !global;
```