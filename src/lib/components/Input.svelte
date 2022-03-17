<script lang="ts">
  export let type = "text"
  export let label: string
  export let name: string
  export let value: any = undefined
  export let placeholder: string = undefined
  export let optional = false
</script>

<label for={name}>{label}</label>
<input {type} {name} id={name} {placeholder} required={!optional} {value}><br>