import { expect, test } from "../fixtures"

for (const input of ["pointer", "keyboard"]) {
  const scenarios = [
    { veto: "root", outcome: "keeps both menus open when the root vetoes" },
    {
      veto: "submenu",
      outcome: "keeps both menus open when the submenu vetoes",
    },
    { veto: "neither", outcome: "closes both menus when neither vetoes" },
  ]
  for (const { veto, outcome } of scenarios) {
    test(`${input} selection ${outcome}`, async ({ open, page }) => {
      await open("menu-close", { veto })
      const root = page.getByRole("button", { name: "Options" })
      const submenu = page.getByRole("menuitem", { name: "Filters" })
      const item = page.getByRole("menuitemcheckbox", { name: "Show archived" })

      if (input === "pointer") {
        await root.click()
        await submenu.click()
        await item.click()
      } else {
        await root.focus()
        await page.keyboard.press("Enter")
        await expect(submenu).toBeFocused()
        await page.keyboard.press("ArrowRight")
        await expect(item).toBeFocused()
        await page.keyboard.press("Enter")
      }

      if (veto === "neither") {
        await expect(root).toHaveAttribute("aria-expanded", "false")
        await expect(item).toBeHidden()
        await expect(root).toBeFocused()
      } else {
        await expect(root).toHaveAttribute("aria-expanded", "true")
        await expect(submenu).toHaveAttribute("aria-expanded", "true")
        await expect(item).toHaveAttribute("aria-checked", "true")
        await expect(item).toBeFocused()
      }
    })
  }
}
