import { css } from 'styled-components'

/** Sorry, I have to do this 'cause it's impossible to style this using what's
 * available in "tableCustomStyles". This is kinda ugly, I know.
 * */
export const dataTableCSS = css`
  .outerTableWrapper {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px 0 rgba(212, 213, 211, 0.7);
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    min-height: 400px;

    &.noMarginBottom {
      margin-bottom: 0 !important;
    }

    &.condensedTable {
      border-radius: 4px;
      border: 1px solid ${(props) => props.theme.colors.lightGrey};
      box-shadow: none;
      margin-bottom: 24px;
      margin-top: 6px;
      min-height: 280px;

      .rdt_TableHeadRow {
        min-height: 38px;
      }

      .rdt_Pagination {
        max-height: 39px;
        min-height: 39px;
      }

      .rdt_TableRow {
        min-height: 40px;
      }

      .rdt_TableCol,
      .rdt_TableCell {
        padding-left: 12px;
        padding-right: 12px;
      }
    }

    .rdt_Table {
      min-width: fit-content;
    }

    .rdt_TableCol {
      div {
        white-space: nowrap;
      }

      .rdt_TableCol_Sortable {
        > span {
          padding: 0 8px;
        }
      }
    }

    .rdt_TableRow {
      border-bottom-color: ${(props) => props.theme.colors.lightGrey}!important;

      &:hover {
        background-color: ${(props) => props.theme.colors.whitesmoke3}!important;
        color: ${(props) => props.theme.colors.darkerGrey}!important;
      }

      &:last-of-type {
        border-bottom: none !important;
      }

      /*
        If item count > 7 three last items' dropdowns grow / show upwards to avoid
        being cut because of overflow hidden...
       */
      &:nth-child(n + 8) {
        .dropdownItems {
          bottom: calc(100% + 10px);
          top: auto;
        }
      }
    }
  }
`
