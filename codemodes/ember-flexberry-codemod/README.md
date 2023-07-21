# ember-flexberry-codemod-update-lookup

A collection of codemods for **updateLookupValue**.
There are 2 types of update:
1) "lookup-hbs" - for templates (.hbs files)
2) "lookup-getCellComponent" - for function getCellComponent

You can see the difference between basic.input and basic.output in *transforms/*

## Usage

To run a specific codemod from this project
1) Use node version 10.20.1
2) Create link to this package with npm-link
3) Run the following command with your parameters:

```
npx ember-flexberry-codemod-update-lookup <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Examples

```
npx ember-flexberry-codemod-update-lookup lookup-hbs app/templates/master-edit.hbs

npx ember-flexberry-codemod-update-lookup lookup-getCellComponent app/
```

## Problem cases

- **"UnhandledPromiseRejectionWarning: Error: Command failed with ENAMETOOLONG"** - This error can appear when there are too many files in the specified directory to parse. (In our case .js or .hbs files). You should try running the command for each folder/file inside the given directory.
