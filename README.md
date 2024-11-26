# utils-client

A collection of tools commonly used by browsers(eg. http-request)

## Usage

```shell
pnpm add @cc-heart/utils-client
```

### Scss Usage

create a overwrite file (e.g. overwrite.scss), and write following content:

```scss
@forward '@cc-heart/utils-client/scss/variable.scss' with (
  $namespace: 'cc'
);
```

create a new scss file (e.g. `lib.scss`), and write following content:

```scss
@use './override.scss' as *;

@forward '@cc-heart/utils-client/scss/function.scss';
@forward '@cc-heart/utils-client/scss/mixins.scss';
```
