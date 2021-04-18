---
date: 2021-04-18
---

An open protocol for building social Web applications.

Part of the [[Beaker browser]] project.

Unwalled.Garden is a kind of “Souped up [[RSS]].” Every user has a website, they publish their content as files, and they subscribe to each others’ sites.

While [[RSS]] was primarily for blogging, Unwalled.Garden includes data types for many kinds of use-cases. These data types are spread across many JSON files which have pre-defined schemas.

The schemas are simple, obvious, and syntax-free. A “post” record looks like this:

```json
{
  "type": "unwalled.garden/post",
  "body": "Hello, world!",
  "createdAt": "2019-05-21T21:27:45.471Z"
}
```

<https://unwalled.garden/>