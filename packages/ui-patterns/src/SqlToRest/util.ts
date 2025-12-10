import type { HttpRequest, Statement, SelfbaseJsQuery } from '@selfbase/sql-to-rest'

export type BaseResult = {
  statement: Statement
}

export type HttpResult = BaseResult &
  HttpRequest & {
    type: 'http'
    language: 'http' | 'curl'
  }

export type SelfbaseJsResult = BaseResult &
  SelfbaseJsQuery & {
    type: 'selfbase-js'
    language: 'js'
  }

export type ResultBundle = HttpResult | SelfbaseJsResult
