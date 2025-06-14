import React, { FC } from "react"
import { MnemonicModal } from "./MnemonicModal"
import { PrivateKeyModal } from "./PrivateKeyModal"
import { WarningModal } from "./WarningModal"
import { SignTransactionModal } from "./SignTransactionModal"
import { NeighborsModal } from "./NeighborsModal"
import { QuestsModal } from "./QuestsModal"
import { ProfileModal } from "./ProfileModal"
import { DownloadModal } from "./DownloadModal"
import { InfoModal } from "./InfoModal"
import { DownloadingModal } from "./DownloadingModal"
import { NFTStorageModal } from "./NFTStorageModal"
import { ShopModal } from "./ShopModal"
import { InventoryModal } from "./InventoryModal"
import { RoadsideStandModal } from "./RoadsideStandModal"
import { SettingsModal } from "./SettingsModal"
import { SellModal } from "./SellModal"
import { UpgradeModal } from "./UpgradeModal"
import { DailyModal } from "./DailyModal"
import { TutorialModal } from "./TutorialModal" 
import { ShipModal } from "./ShipModal"
import { BuyGoldsModal } from "./BuyGoldsModal"
import { NFTsClaimedModal } from "./NFTsClaimedModal"
import { WelcomeModal } from "./WelcomeModal"
import { ConnectModal } from "./ConnectModal"
import { AuthenticatingModal } from "./AuthenticatingModal"
import { NeighborsFilterModal } from "./NeighborsFilterModal"
import { SelectInventoriesModal } from "./SelectInventoriesModal"
import { ReferralModal } from "./ReferralModal"
import { PurchaseNFTBoxesModal } from "./PurchaseNFTBoxesModal"
import { NFTConversionModal } from "./ConvertNFTModal"
import { SelectNFTCollectionModal } from "./SelectNFTCollectionModal"
import { NotificationModal } from "./NotificationModal"
import { BuyEnergyModal } from "./BuyEnergyModal"
import { SelectChainModal } from "./SelectChainModal"
import { WalletConnectionRequiredModal } from "./WalletConnectionRequiredModal"
import { ExpandLandLimitModal } from "./ExpandLandLimitModal"

export const MODAL_CONTAINER_ID = "modals"

const Modals : FC = () => {
    return (
        <div id={MODAL_CONTAINER_ID}>
            <MnemonicModal />
            <PrivateKeyModal />
            <WarningModal />
            <NotificationModal />
            <ProfileModal />
            <SignTransactionModal />
            <NFTsClaimedModal />
            <WelcomeModal />
            <NeighborsModal />
            <QuestsModal />
            <SelectNFTCollectionModal />
            <NFTConversionModal />
            <ReferralModal />
            <TutorialModal />
            <DownloadModal />
            <DownloadingModal />
            <InfoModal />
            <ConnectModal />
            <SelectChainModal />
            <SettingsModal />
            <InventoryModal />
            <RoadsideStandModal />
            <NFTStorageModal />
            <ShopModal />
            <SelectInventoriesModal />
            <AuthenticatingModal />
            <SellModal />
            <UpgradeModal />
            <DailyModal />
            <PurchaseNFTBoxesModal />
            <ShipModal />
            <NeighborsFilterModal />
            <BuyGoldsModal />
            <BuyEnergyModal />
            <ExpandLandLimitModal />
            <WalletConnectionRequiredModal />
        </div>
    )
}
export default Modals