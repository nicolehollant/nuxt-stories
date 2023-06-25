# Button

It's cute as a button 🥰

---

## Usage

Use `default` slot to render content inside the button

::ComponentExample
---
is: SenpButton
ignoreProps:
- label
props:
  label: Hello World
---
#code
```vue
<SenpButton>Hello world</SenpButton>
```
::

Use the `label` prop to render content inside the button

::ComponentExample
---
is: SenpButton
props:
  label: Hello World
---
#code
```vue
<SenpButton :label="Hello world"></SenpButton>
```
::

### Size

Use the `size` prop to control the size of the button

::ComponentExample
---
is: SenpButton
ignoreProps:
- label
props:
  size: md
  label: Hello World
controls:
  size:
    type: string
    options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl']
---
#code
```vue
<SenpButton size="md">Hello world</SenpButton>
```
::

### Size

Use the `size` prop to control the size of the button

::ComponentExample
---
is: SenpButton
ignoreProps:
- label
props:
  size: md
  label: Hello World
controls:
  size:
    type: string
    options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl']
---
#code
```vue
<SenpButton size="md">Hello world</SenpButton>
```
::

### Icon

Use icons from [Iconify](https://icones.js.org/) in your button with the `leading` and `trailing` props

::ComponentExample
---
is: SenpButton
ignoreProps:
- label
props:
  label: hello
  leading: mdi:information
  trailing: mdi:close
---
#code
```vue
<SenpButton size="md">Hello world</SenpButton>
```
::

Don't pass any label content for an icon button

::ComponentExample
---
is: SenpButton
props:
  leading: mdi:account-edit
---
#code
```vue
<SenpButton leading="mdi:account-edit"></SenpButton>
```
::

Use the `loading` prop in conjunction with th `loadingIcon` prop to show a loading spinner while loading


::ComponentExample
---
is: SenpButton
props:
  loading: true
  loadingIcon: mdi:loading
---
#code
```vue
<SenpButton leading="mdi:account-edit"></SenpButton>
```
::