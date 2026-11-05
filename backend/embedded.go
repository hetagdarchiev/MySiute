package main

import _ "embed"

//go:embed schema.sql
var schema string

//go:embed seed.json
var seed []byte

//go:embed schema2.sql
var schema2 string
