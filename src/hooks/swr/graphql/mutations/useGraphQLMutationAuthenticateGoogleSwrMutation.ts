// import useSWRMutation from "swr/mutation"
// import { UseSWRMutation } from "../../types"
// import {
//     GraphQLResponse,
// } from "@/modules/apollo"

// // export type UseGraphQLMutationAuthenticateGoogleArgs =
// //   MutationAuthenticateGoogleParams;

// export const useGraphQLMutationAuthenticateGoogleSwrMutation =
//   (): UseSWRMutation<
//     GraphQLResponse<AuthenticatorResponse> | null
//     // UseGraphQLMutationAuthenticateGoogleArgs
//   > => {
//       const key: string = "AUTHENTICATE_GOOGLE"
//       const swrMutation = useSWRMutation(
//           key,
//           async (
//               _,
//               //   extraArgs: { arg: UseGraphQLMutationAuthenticateGoogleArgs }
//           ) => {
//               //first, we call the api to request the message
//               // const params = { ...extraArgs.arg }
//               //   const result = await mutationAuthenticateGoogle(params)
//               //   if (!result.data) {
//               //       throw new Error(
//               //           result.errors?.[0]?.message || "Failed to authenticate google"
//               //       )
//               //   }
//               //   return result.data.authenticateGoogle

//               return null
//           }
//       )

//       //return the state and the data
//       return {
//           swrMutation,
//       }
//   }
