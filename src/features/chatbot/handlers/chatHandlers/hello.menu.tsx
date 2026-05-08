/**
 * This file re-exports from welcome.tsx for backwards compatibility.
 * The main logic now lives in menus/welcome.tsx
 */
export {
  displayWelcomeMenu as helloMenu,
  displayResetConfirmation,
  proceedWithWelcome,
} from "./menus/welcome";
