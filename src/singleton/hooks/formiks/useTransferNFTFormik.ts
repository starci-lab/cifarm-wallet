import { FormikProps, useFormik } from "formik"
import * as Yup from "yup" // Import Yup
import { useSingletonHook } from "../../core"
import { SIGN_TRANSACTION_MODAL_DISCLOSURE } from "../../keys"
import { useDisclosure } from "react-use-disclosure"
import {
    setSignTransactionModalContent,
    TransactionType,
    useAppDispatch,
} from "@/redux"
import { NFTCollectionKey } from "@/types"
import { BlockchainNFTData } from "@/modules/apollo"

export interface TransferNFTFormikValues {
  nft?: BlockchainNFTData;
  collectionKey: NFTCollectionKey;
  recipientAddress: string;
}

export const useTransferNFTFormik = (): FormikProps<TransferNFTFormikValues> => {
    const { open } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        SIGN_TRANSACTION_MODAL_DISCLOSURE
    )
    const dispatch = useAppDispatch()
    const initialValues: TransferNFTFormikValues = {
        collectionKey: NFTCollectionKey.DragonFruit,
        recipientAddress: "",
    }

    // Yup validation schema
    const validationSchema = Yup.object({
        recipientAddress: Yup.string().required("Recipient address is required"),
    })

    const formik = useFormik({
        initialValues,
        validationSchema, // Pass Yup validation schema directly
        onSubmit: async ({ recipientAddress, collectionKey, nft }) => {
            if (!nft) throw new Error("NFT is required")
            // onpen the sign transaction moda
            dispatch(
                setSignTransactionModalContent({
                    type: TransactionType.TransferNFT,
                    data: {
                        recipientAddress,
                        collectionKey,
                        nft,
                    },
                    saveAddress: recipientAddress,
                })
            )
            open()
        },
    })

    return formik
}
