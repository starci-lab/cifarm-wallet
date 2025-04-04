// import {
//     NEIGHBORS_DISCLOSURE,
//     GRAPHQL_QUERY_USER_SWR,
//     QUESTS_DISCLOSURE,
// } from "@/app/constants"
// import { Avatar, AvatarImage } from "@/components"
// import { useDisclosure, useGraphQLQueryUserSwr } from "@/hooks"
// import { computeExperiencesQuota } from "@/modules/common"
// import { createJazziconBlobUrl } from "@/modules/jazz"
// import { useSingletonHook } from "@/modules/singleton-hook"
import React, { FC } from "react"

export const Profile : FC = () => {
    // const { swr } =
    // useSingletonHook<ReturnType<typeof useGraphQLQueryUserSwr>>(GRAPHQL_QUERY_USER_SWR)
    //const user = swr.data?.data.user
    // const avatarUrl = user
    //     ? user.avatarUrl ?? createJazziconBlobUrl(user.accountAddress)
    //     : ""
    // const quota = user ? computeExperiencesQuota(user.level) : 0

    // const { onOpen: onNeighborsOpen } = useSingletonHook<ReturnType<typeof useDisclosure>>(NEIGHBORS_DISCLOSURE)
    // const { onOpen: onQuestsOpen } = useSingletonHook<ReturnType<typeof useDisclosure>>(QUESTS_DISCLOSURE)
    return (
        <div>
            {/* <div className="flex gap-4 items-center">
                <Avatar>
                    <AvatarImage src={avatarUrl} className="w-20 h-20 min-w-20 min-h-20" />
                </Avatar>
                <div>
                    {/* {user ? (
                        <>
                            <div className="flex gap-2 items-center">
                                <div className="text-xl font-bold">{user.username}</div>
                                {user ? (
                                    <Chip
                                        classNames={{
                                            content: "pr-0",
                                        }}
                                        className="px-2 flex-1 sm:flex-none sm:w-1/2"
                                        startContent={
                                            <Image
                                                radius="none"
                                                className="w-5 h-5"
                                                removeWrapper
                                                src={blockchainMap[user.chainKey].imageUrl}
                                            />
                                        }
                                        variant="flat"
                                        color="primary"
                                    >
                                        {blockchainMap[user.chainKey].name}
                                    </Chip>
                                ) : null}
                            </div>
                            <Spacer y={2} />
                            <div className="flex gap-2 items-center">
                                <div className="text-sm">{`UID: ${truncateString(
                                    user.id
                                )}`}</div>
                                <Snippet
                                    codeString={user.id}
                                    hideSymbol
                                    classNames={{
                                        symbol: "text-muted-foreground",
                                        base: "p-0 gap-0 bg-transparent",
                                    }}
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="text-sm">{`Address: ${truncateString(
                                    user.accountAddress
                                )}`}</div>
                                <Snippet
                                    hideSymbol
                                    codeString={user.accountAddress}
                                    classNames={{
                                        symbol: "text-muted-foreground",
                                        base: "p-0 gap-0 bg-transparent",
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton />
                            <Skeleton />
                        </>
                    )}
                </div>
            </div>
            <Spacer y={4} />
            <div>
                {user ? (
                    <Progress
                        label={`Lv.${user.level} (${user.experiences}/${quota})`}
                        value={(user.experiences * 100) / quota}
                    />
                ) : (
                    <Skeleton />
                )}
            </div>
            <Spacer y={6} />
            <div>
                <div className="flex gap-2 items-center">
                    <div className="text-lg font-bold">Achievements</div>
                    <ExclamationTooltip message="Achievements and badges earned by the user." />
                </div>
                <Spacer y={4} />
              Currently, there are no achievements.
            </div>
            <Spacer y={6} />
            <div>
                <div className="flex gap-2 items-center">
                    <div className="text-lg font-bold">Features</div>
                    <ExclamationTooltip message="Features and capabilities of the user." />
                </div>
                <Spacer y={4} />
                <div className="flex gap-2">
                    <Card isPressable onPress={() => {
                        onNeighborsOpen()
                    }}>
                        <CardBody className="p-3">
                            <Image removeWrapper src="/assets/ui/icons/neighbors.png" className="w-20 h-20" />
                            <Spacer y={2}/>
                            <div className="text-center">Neighbors</div>
                        </CardBody>
                    </Card>
                    <Card isPressable onPress={() => {
                        onQuestsOpen()
                    }}>
                        <CardBody className="p-3">
                            <Image removeWrapper src="/assets/ui/icons/quests.png" className="w-20 h-20" />
                            <Spacer y={2}/>
                            <div className="text-center">Quests</div>
                        </CardBody>
                    </Card>
                </div>
            </div> */}
        </div>
    )
}