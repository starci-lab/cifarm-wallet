import React, { FC } from "react"
import { MnemonicModal } from "./Mnemonic"
import { PrivateKeyModal } from "./PrivateKey"
import { WarningModal } from "./Warning"
import { SignTransactionModal } from "./SignTransaction"
import { ReferralLinkModal } from "./ReferralLinkModal"
import { NeighborsModal } from "./Neighbors"
import { QuestsModal } from "./Quests"

export const MODAL_CONTAINER_ID = "modals"
const Modals : FC = () => {
    return (
        <div>
            <MnemonicModal />
            <PrivateKeyModal />
            <WarningModal />
            <SignTransactionModal />
            <ReferralLinkModal />
            <NeighborsModal />
            <QuestsModal />
        </div>
    )
}
export default Modals