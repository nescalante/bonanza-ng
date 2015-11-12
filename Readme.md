# Bonanza ng

> Angular autocomplete directive using [Bonanza](http://www.github.com/nescalante/bonanza)

# Install

Use it as an npm package:

```shell
npm install bonanza-ng --save
```

Or just download it from bower

```shell
bower install bonanza-ng --save
```

# Usage

Use it over an input

```html
<input type="text"
   ng-model="owner"
   bonanza
   bonanza-request="getUsers($query)"
   bonanza-value-template="firstName + ' ' + lastName"
   bonanza-item-template="firstName + ' ' + lastName + ' (' + email + ')'"
   bonanza-on-select="ownerChanges = ownerChanges + 1"
   bonanza-is-loading="loadingUsers">
```

You will have to define in the controller a function for the request:

```js
$scope.getUsers = function (query) {
  return usersResource
    .get(query)
    .$promise;
};
```

Ensure that the function returns a Promise.

# License

MIT
