
export const presetScss = `
@use 'sass:string';

$namespace: 'cc' !default;
$common-separator: '-' !default;
$element-separator: '__' !default;
$modifier-separator: '--' !default;
$is-at-root: true !default;


@function join($el...) {
  $temp_var_length: 0;
  $temp_var: '';
  $len: 0;

  @each $item in $el {
    $len: string.length($temp_var);
    $temp_var: string.insert($temp_var, $item, $len + 1);
    $temp_var_length: $temp_var_length + $len;
  }

  @return $temp_var;
}

@function joinVar($args...) {
  $namespaces: --#{$namespace};

  @each $item in $args {
    $namespaces: #{$namespaces}-#{$item};
  }

  @return $namespaces;
}

@function getCssVarName($args...) {
  @return joinVar($args...);
}

@function getCssVar($args...) {
  @return var(#{joinVar($args...)});
}

@function getCssVarWithDefault($args, $default) {
  @return var(#{joinVar($args)}, $default);
}


$b: null;
$e: null;
$m: null;

@mixin isAtRoot() {
  @if ($is-at-root) {
    @at-root {
      @content;
    }
  }

  @else {
    @content;
  }
}

@mixin b($block) {
  $b: join($namespace, $common-separator, $block) !global; // 局部变量

  .#{$b} {
    @content;
  }
}

@mixin e($element...) {
  $e: #{$b};
  $currentSelector: (
  );

@each $item in $element {
  $currentSelector: append($currentSelector,
      join($e, $element-separator, $item),
      comma);
}

$e: $currentSelector !global;

@include isAtRoot {
  .#{$currentSelector} {
    @content;
  }
}
}

@mixin m($modify...) {
  $m: (
  );
$currentSelector: (
);

@each $_b in $e {
  $current: (
  );
$m: append($m, $_b, comma);
}

@each $_e in $m {
  $current: (
  );

@each $unit in $modify {
  $current: append($current, join($_e, $modifier-separator, $unit), comma);
}

$currentSelector: append($currentSelector, $current, comma);
}

@include isAtRoot {
  .#{$currentSelector} {
    @content;
  }
}
}
`