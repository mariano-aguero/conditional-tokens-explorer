import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { CloseIcon } from 'components/icons/CloseIcon'
import { IconDelete } from 'components/icons/IconDelete'
import { IconEdit } from 'components/icons/IconEdit'
import { IconOk } from 'components/icons/IconOk'
import { IconPlus } from 'components/icons/IconPlus'

const Wrapper = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  height: 20px;
  outline: none;
  padding: 0;
  width: 20px;

  .fill {
    fill: ${(props) => props.theme.colors.darkGrey};
  }

  &:hover {
    .fill {
      fill: ${(props) => props.theme.colors.primary};
    }

    .iconDelete {
      .fill {
        fill: ${(props) => props.theme.colors.delete};
      }
    }
  }

  &:active {
    opacity: 0.6;
  }

  &[disabled],
  &[disabled]:hover {
    cursor: not-allowed;
    opacity: 0.5;

    svg {
      .fill {
        fill: ${(props) => props.theme.colors.darkGrey}!important;
      }
    }
  }
`

export enum ButtonControlType {
  ok = 1,
  delete = 2,
  edit = 3,
  add = 4,
  cancel = 5,
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: ButtonControlType
  className?: string
}

export const ButtonControl: React.FC<Props> = (props) => {
  const { className, buttonType = ButtonControlType.ok, ...restProps } = props

  return (
    <Wrapper className={`${className} buttonControl`} {...restProps}>
      {buttonType === ButtonControlType.delete && <IconDelete />}
      {buttonType === ButtonControlType.ok && <IconOk />}
      {buttonType === ButtonControlType.edit && <IconEdit />}
      {buttonType === ButtonControlType.add && <IconPlus />}
      {buttonType === ButtonControlType.cancel && <CloseIcon />}
    </Wrapper>
  )
}
