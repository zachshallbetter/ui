import { useState } from "react"
import { createRoot } from "react-dom/client"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { menuOptions } from "tests/fixtures/page.ts"

function Fixture() {
  const veto = new URLSearchParams(location.search).get("veto")
  const [checked, setChecked] = useState(false)

  return (
    <div className="fixture">
      <button>Before</button>
      <Menu
        {...menuOptions()}
        onOpenChange={(open, details) => {
          if (!open && veto === "root" && details.reason === "item-press") {
            details.cancel()
          }
        }}
      >
        <MenuTrigger>Options</MenuTrigger>
        <MenuContent className="popup">
          <MenuSub
            onOpenChange={(open, details) => {
              if (
                !open &&
                veto === "submenu" &&
                details.reason === "parent-close"
              ) {
                details.cancel()
              }
            }}
          >
            <MenuSubTrigger className="item">Filters</MenuSubTrigger>
            <MenuSubContent className="popup">
              <MenuCheckboxItem
                className="item"
                value="archived"
                checked={checked}
                onCheckedChange={setChecked}
                closeOnSelect
              >
                Show archived
              </MenuCheckboxItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
