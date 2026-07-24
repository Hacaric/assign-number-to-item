import { Participant, User, Vote } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { GetParticipantData, GetUserData } from "@/src/lib/user_utils";
import { LogOutParticipant } from "./logout";

export default async function Account() {
    const user: User|null = await GetUserData();
    let users_participant = null;
    if (user) {
        users_participant = await prisma.participant.findUnique({
            where: {uuid: user.participant_uuid},
            include: {votes: true}
        })
    }
    const participant:Participant&{votes:Vote[]}|null = user ? users_participant : await GetParticipantData();

    if (!user && !participant) {
        return <div>
            <b>You should have been redirected to /register</b>
            <p>This should never happen, please contact system administrators.</p>
            <i>Our middleware is cooked rn</i>
        </div>
    }
    return <div className="grid grid-cols-3 items-start">
        <div>
            <p className="p-0 m-0 mt-5 ml-5">
                <a href="/" className="underline mx-1">Home</a>
            </p>
        </div>
        <div className="m-5">
        <h2 className="mt-5">Manage account</h2>
        <br />
        {
            !user && participant &&
            <p className="italic">Logged in as Anonymous participant</p>
        }
        {
            user &&
            <p className="italic">Logged in as user '{user ? user.username : 'Error loading username'}'</p>
        }
        {
            participant &&
            <div>
                <h3 className="font-bold pt-5">Participant data</h3>
                <p>First joined: {participant.first_joined.toUTCString()}</p>
                <h3 className="font-bold pt-5">Votes</h3>
                <div>
                    {
                        participant.votes.map(async (vote) => {
                            const item = await prisma.item.findUnique({
                                where: {studyId_id: {studyId: vote.study_id, id: vote.item_id}}
                            })
                            const voteOption = await prisma.voteOption.findUnique({
                                where: {studyId_id: {studyId: vote.study_id, id: vote.chosen_option_id}}
                            })
                            if (!item || !voteOption){ return <p>Failed to load.</p>}
                            return <div>
                                <p>Assigned option '{voteOption.name}' to item 
                                    <a href={`/study/${vote.study_id}/item/${vote.item_id}`}
                                    className="underline cursor-pointer pl-1">
                                        {item.name}
                                    </a>
                                </p>
                            </div>
                        })
                    }
                </div>
            </div>
        }
        {
            !user && participant &&
            <LogOutParticipant />
        }
    </div>
    </div>
}