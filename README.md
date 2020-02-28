# vaLittle
Lightweight validation plugin in pure js

## Example of ussage
### In main.js add these lines
```
  import vaLittle from 'vue-valittle'
  Vue.use(vaLittle);
```

### In your component:
```
  <template>
   <div>
     <span class="text-error" v-if="errors.username && errors.username.errors">
        {{ errors.username.message }}
     </span>
    <input type="text" v-model="form.username" >
    <button v-on:click="send()">Send</button>
   </div>
  <template>

  <script>
      export default {
        name: 'loginForm',
        data: function() {
          return {
            form:{
              username:'',
            }
            errors:{}
          }
        },
        validate: {
          messages:{
            username:{
              required: 'To pole jest wymagane!'
            }
          },
          rules:{
            username:{
              required:true
            }
          }
        },
        methods:{
          send: function() {
            this.errors = this.$vaLittle.check(this.form);
            if (!this.errors.errors) {
              console.log('IS OK!');
            }else{
              console.log('IS NOT OK!');
            }
          }
        }
     }
  </script>
```
## Rules

### Custom Regex
As param set custom regular expession
```
  regex:'/^([a-zA-Z _-]+)$/'
```
### Callback
Test by custom function. In this example I pass through 'v' vaLittle's this. 'v.formData' is form object with inputs values.
Example:
```
callback:(vltlThis) => {

  // check if input is not empty
  if (!v.required(v.formData.name)) {

    // add new rule to another input if 'name' input is not empty
    v.rules.surname = {required:true};

    //Let's see what is inside vaLittle now
    console.log(v);

  }else{
    console.log('true means error');
  }

}
```
### Text only
Accepts only upper and lower letters
```
  text:true
```
### Numbers Only
Accepts only numbers
```
  number:true
```
### Max value
Set max number value
```
  maxVal:5
```
### Min value
Set min number value
```
  minVal:5
```
### Min length
Set min field length
```
  min:5
```
### Max length
Set max field length
```
  max:5
```
### Require
Requires value
```
  require:true
```
### Require from group
Requires value from one or more inputs in group
```
  requireGroup:'group_name'
```
### Require equal values in group
Requires thesame values in group
```
  equalGroup:'group_name'
```
### Post Code
Requires a post code format XX-XXX
```
  postCode:true
```
### Phone
Requires a valid phone
```
  phone:true
```
### E-mail
Requires a valid e-mail
```
  email:true
```
