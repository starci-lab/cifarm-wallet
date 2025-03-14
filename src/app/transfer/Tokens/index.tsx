"use client"
import React, { FC } from "react"
import { useSingletonHook, useSingletonHook2 } from "@/modules/singleton-hook"
import { Button, Image, Input, Spacer } from "@heroui/react"
import { setSelectTokenModal, useAppDispatch, useAppSelector } from "@/redux"
import { useDisclosure } from "@heroui/react"
import {
    SELECT_TOKEN_DISCLOSURE,
    TRANSFER_TOKEN_FORMIK,
} from "@/app/constants"
import { valuesWithKey } from "@/modules/common"
import { NumberInput, Title } from "@/components"
import { useTransferTokenFormik } from "@/hooks"

export const Tokens: FC = () => {
    const formik = useSingletonHook2<ReturnType<typeof useTransferTokenFormik>>(
        TRANSFER_TOKEN_FORMIK
    )
    const tokens = useAppSelector((state) => state.sessionReducer.tokens)
    const tokensArray = valuesWithKey(tokens)
    const selectedTokenKey = formik.values.tokenKey || tokensArray[0].key
    const { onOpen } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        SELECT_TOKEN_DISCLOSURE
    )
    const dispatch = useAppDispatch()
    return (
        <form
            onSubmit={formik.handleSubmit}
            onReset={formik.handleReset}
            className="flex flex-col justify-between h-full"
        >
            <div>
                <div>
                    <Title
                        title="Token"
                        tooltipString="Select the token you want to transfer"
                    />
                    <Spacer y={1.5} />
                    <Button
                        className="justify-start"
                        fullWidth
                        startContent={
                            <Image
                                src={tokens[selectedTokenKey].imageUrl}
                                alt={tokens[selectedTokenKey].name}
                                className="w-5 h-5"
                            />
                        }
                        onPress={() => {
                            dispatch(
                                setSelectTokenModal({
                                    tokenKey: selectedTokenKey,
                                    callback: (tokenKey) => {
                                        formik.setFieldValue("tokenKey", tokenKey)
                                    },
                                })
                            )
                            onOpen()
                        }}
                    >
                        {tokens[selectedTokenKey].name}
                    </Button>
                </div>
                <Spacer y={4} />
                <div>
                    <div className="flex items-center justify-between">
                        <Title
                            title="Amount"
                            tooltipString="Enter the amount you want to transfer"
                        />
                        <div className="text-sm text-gray-400">Balance: 0</div>
                    </div>
                    <Spacer y={1.5} />
                    <NumberInput
                        id="stringAmount"
                        labelPlacement="outside"
                        label=""
                        value={formik.values.stringAmount}
                        onValueChange={(value) => {
                            formik.setFieldValue("stringAmount", value)
                        }}
                        onBlur={formik.handleBlur}
                        isInvalid={
                            !!(formik.touched.stringAmount && formik.errors.stringAmount)
                        }
                        errorMessage={
                            formik.touched.stringAmount && formik.errors.stringAmount
                        }
                    />
                </div>
                <Spacer y={4} />
                <div>
                    <Title
                        title="Recipient"
                        tooltipString="Enter the recipient address"
                    />
                    <Spacer y={1.5} />
                    <Input
                        id="recipientAddress"
                        value={formik.values.recipientAddress}
                        onValueChange={(value) => {
                            formik.setFieldValue("recipientAddress", value)
                        }}
                        onBlur={formik.handleBlur}
                        isInvalid={
                            !!(
                                formik.touched.recipientAddress &&
                formik.errors.recipientAddress
                            )
                        }
                        errorMessage={
                            formik.touched.recipientAddress && formik.errors.recipientAddress
                        }
                    />
                </div>
                <Spacer y={6} />
            </div>
            <Button type="submit" fullWidth>
        Transfer
            </Button>
        </form>
    )
}
