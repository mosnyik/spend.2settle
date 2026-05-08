// import { getStepService } from "@/core/machines/parent.machine";
// import { StepId } from "@/core/machines/steps";
// import useChatStore from "stores/chatStore";
// import type { StateValue } from "xstate";

// function getTopLevelStep(value: StateValue): StepId {
//   if (typeof value === "string") return value as StepId;
//   return Object.keys(value)[0] as StepId;
// }

// export function bindXStateToZustand() {
//   const stepService = getStepService();
//   stepService.subscribe((snapshot) => {
//     const step = getTopLevelStep(snapshot.value);

//     useChatStore.setState({
//       snapshot,
//       currentStep: step,
//       context: snapshot.context,
//     });
//   });
// }
