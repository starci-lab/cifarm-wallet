"use client"
import React from "react"
import { ExtendedButton } from "@/components"
import { useIsMobile, useRouterWithSearchParams } from "@/hooks"
import { useState } from "react"
import { Logo } from "./Logo"
import { MobileMenu } from "./MobileMenu"
import { PulsatingActionButton } from "../Hero/PulsatingActionButton"
import { List } from "@phosphor-icons/react"
import { pathConstants } from "@/constants"

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isMobile = useIsMobile()
    const router = useRouterWithSearchParams()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className="w-full overflow-hidden sticky top-0 z-50">
            {/* Blurred background */}
            <div className="absolute inset-0 bg-opacity-95 backdrop-blur-sm z-0"></div>
            <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
                <Logo />
                {/* Desktop Navigation */}
                {!isMobile && <div className="flex items-center gap-4">
                    <PulsatingActionButton
                        onClick={() => {
                            router.push(pathConstants.signIn)
                        }}
                    >
                        Play
                    </PulsatingActionButton>
                </div>}
                {/* Mobile Menu Button */}
                {isMobile && (
                    <ExtendedButton
                        onClick={toggleMenu}
                        className="text-secondary p-2 focus:outline-none bg-transparent hover:bg-transparent"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        <List />
                    </ExtendedButton>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
        </header>
    )
}
