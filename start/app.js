'use strict'

const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/auth/providers/AuthProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  '@adonisjs/lucid/providers/LucidProvider',
  '@adonisjs/validator/providers/ValidatorProvider',
  '@adonisjs/drive/providers/DriveProvider',
  'adonis-lucid-filter/providers/LucidFilterProvider',
]

const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider'
]

const aliases = {}

const commands = []

module.exports = { providers, aceProviders, aliases, commands }
