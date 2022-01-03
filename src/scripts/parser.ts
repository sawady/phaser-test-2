import * as peggy from 'peggy'

const parser = peggy.generate(
  `
StateDefs
	= _ defs:StateDef* { return defs }

StateDef
  = _ "[" _ "state" _ state:string _ "]" params: Param* actions:Action* { return { state, params, actions } }

Action
  = _ "[" name:string _ "]" params:Param* { return { name, params } }

Param
  = _ name:string _ "=" _ expr:additive { return { name, expr } }

additive
  = _ left:multiplicative _ op:("+"/"-") _ right:additive { return { exp1: left, op, exp2: right }; }
  / multiplicative

multiplicative
  = _ left:primary _ op:("*"/"/") _ right:multiplicative { return { exp1: left, op, exp2: right }; }
  / primary

primary
  = op:("-") "(" expr:additive ")" { return { op, exp1: expr } }
  / op:("-") expr:primary { return { op, exp1: expr } }
  / op:("!") "(" expr:additive ")" { return { op, exp1: expr } }
  / op:("!") expr:primary { return { op, exp1: expr } }
  / expr:integer
  / expr:string

integer "integer"
  = digits:[0-9]+ { return parseInt(text(), 10); }
  
string "string"
  = _ [_a-z-A-Z]+ [0-9]* { return text(); }

_ "whitespace"
  = [ \\\t\\\n\\\r]*
`,
  { optimize: 'speed' }
)

export default parser
