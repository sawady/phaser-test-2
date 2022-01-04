import * as peggy from 'peggy'
import lodash from 'lodash'

const parser = peggy.generate(
  `
Game
	= game:GameInfo scenes:Scene* _ { return { game, scenes } }

GameInfo
  = _ "[" _ "game" _ "]" params: Param* { return { params } }

Scene
  = _ "[" _ "scene" _ scene:string _ "]" params: Param* states:State* { return { scene, params, states } }

State
  = _ "[" _ "state" _ state:string _ "]" params: Param* actions:Action* { return { state, params, actions } }

Action
  = _ "[" _ "action" _ name:string _ "]" params:Param* { return { name, params } }

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
  / op:string "(" expr:additive _ ")" { return { op, exp: expr } } 
  / expr:integer
  / expr:string

integer "integer"
  = digits:[0-9]+ { return parseInt(text().trim(), 10); }

string "string"
  = [ .#_a-z-A-Z]+ [0-9]* { return text().trim(); }

_ "whitespace"
  = [ \\t\\n\\r]*
`,
  { optimize: 'speed' }
)

const parsed = parser.parse(
  `
  [game]
  type = Phaser.AUTO
  background-color = #ffffff
  scale.parent = phaser-game
  scale.mode = Phaser.Scale.FIT
  scale.auto-center = Phaser.Scale.CENTER_BOTH
  scale.width = 1280
  scale.height = 720
  physics.default = arcade
  physics.debug  = true
  physics.gravity.x = 0
  physics.gravity.y = 100
  
  [scene preload]
  
  [state standing]
  spite = phaser-logo
  
  [action vel-set]
  x = 100
  
  [scene main]
`
)

console.log(parsed)

const lookup = (obj: any, name: string) => lodash.find(obj, { name })?.expr

export { parser, parsed, lookup }
