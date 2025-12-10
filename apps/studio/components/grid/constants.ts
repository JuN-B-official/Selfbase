export const COLUMN_MIN_WIDTH = 100

export const STORAGE_KEY_PREFIX = 'selfbase_grid'

export const TOTAL_ROWS_INITIAL = -1
export const TOTAL_ROWS_RESET = -2

export const SELECT_COLUMN_KEY = 'selfbase-grid-select-row'
export const ADD_COLUMN_KEY = 'selfbase-grid-add-column'

const RLS_ACKNOWLEDGED_KEY = 'selfbase-acknowledge-rls-warning'

export const rlsAcknowledgedKey = (tableID?: string | number) =>
  `${RLS_ACKNOWLEDGED_KEY}-${String(tableID)}`

export const ROW_CONTEXT_MENU_ID = 'row-context-menu-id'
