# starter.store

A starter store powered by FastStore.

![FastStore CLI](https://img.shields.io/github/package-json/dependency-version/vtex-sites/starter.store/@faststore/cli)

## Getting started

Install dependencies
```bash
yarn i
```  

Start local dev server at http://localhost:3000
```bash
yarn dev
```   

Production build
```bash
yarn build
```

### Docs 
[FastStore documentation](https://developers.vtex.com/docs/guides/faststore)

## Subi component para o cms
- ➜ git pull --no-rebase origin schema
- ➜ vtex content split-components 
- ➜ vtex content generate-schema --out cms/schema.json
- ➜ vtex content upload-schema cms/schema.json
- ➜ git add cms/faststore/sections.json
- ➜ git commit -m "update sections"
- ➜ git push origin yourBranch:schema

## DEPLOY
- git pull origin main
- yarn build
- git merge main
- git push origin main

### Review 
- https://help.hiplatform.com/docs/instala%C3%A7%C3%A3o-do-script-e-elementos-na-loja-faststore