# ember-flexberry-codemod-update-lookup

A collection of codemods for **updateLookupValue**.
There are 2 types of update:
1) "lookup-hbs" - for templates (.hbs files)
2) "lookup-getCellComponent" - for function getCellComponent

You can see the difference between basic.input and basic.output in *transforms/*

## Usage

To run a specific codemod: 
1) ```nvm use 10.20.1```
2) ```npm link``` - in codemod root folder
3) ```npm link ember-flexberry-codemod-update-lookup``` - in your project root folder. You should use the name which is defined in *package.json* from codemod root folder.
4) Now you can use the following command with your parameters:

```
npx ember-flexberry-codemod-update-lookup <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Examples

```
npx ember-flexberry-codemod-update-lookup lookup-hbs app/templates/master-edit.hbs

npx ember-flexberry-codemod-update-lookup lookup-getCellComponent app/
```

## Important

After update component templates (.hbs files), you must append action into component ```actions```, like showed this:
```
updateLookupValue(updateData) {
  this.get('currentController').send('updateLookupValue', updateData);
}
```

## Problem cases

- **"UnhandledPromiseRejectionWarning: Error: Command failed with ENAMETOOLONG"** - This error can appear when there are too many files in the specified directory to parse. (In our case .js or .hbs files). You should try running the command for each folder/file inside the given directory.

- **"UnhandledPromiseRejectionWarning: Error: Command failed with ENOENT: ember-template-recast -t ..."** - just use the command ```npm install ember-template-recast@^4.1.4``` in your project directory. The actual version of package is defined in *package.json* from codemod root folder.
