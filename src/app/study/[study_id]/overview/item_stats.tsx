import { prisma } from "@/lib/prisma";
import { assert } from "node:console";
import { Chart } from "./chart";
import { GetUserVotes } from "@/src/lib/user_utils";

export const chart_color = 'rgba(47, 255, 20, 0.65)';
export const chart_user_color = 'rgba(25, 138, 10, 0.65)'

export async function ItemStats({study_id, item_id}: { study_id: number, item_id: number }){
    const study = await prisma.study.findUnique({
        where: {id: study_id},
        include: {voting_options: true}
    })
    if (!study) {
        return <div>Failed to load study with id={study_id}</div>
    }

    const item = await prisma.item.findUnique({
        where: {studyId_id: {studyId: study_id, id: item_id}},
        include: {votes: true}
    })
    if (!item){
        return <div>Failed to load item with id={item_id}, study_id={study_id}</div>
    }

    const user_votes = await GetUserVotes();
    let user_chose_option:number|null = null;
    if (user_votes){
        const user_vote_relevant = user_votes.filter((vote)=> vote.study_id==study_id && vote.item_id==item_id)
        assert(user_vote_relevant.length <= 1);

        if (user_vote_relevant) {
            user_chose_option = user_vote_relevant[0].chosen_option_id;
        }
    }

    const votes = item.votes;
    let vote_per_option: number[] = Array(study.voting_options.length).fill(0);
    votes.forEach(
        (vote) => {vote_per_option[vote.chosen_option_id] += 1;}
    )
    console.debug(`Votes per options: ${vote_per_option}`)
    const option_labels = study.voting_options.map((vote_option) => vote_option.name);

    assert(option_labels.length == vote_per_option.length); 


    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top' as const,
            },
            title: {
            display: true,
            text: `${item.name}`,
            },
        },
    };

    const data = {
    labels: option_labels,
    datasets: [
        {
            label: 'number of votes',
            data: vote_per_option,
            backgroundColor: vote_per_option.map((_, i) => (user_chose_option == i) ? chart_user_color : chart_color),
        },
        // {
        //     label: 'your vote',
        //     data: [],
        //     backgroundColor: chart_user_color,
        // }
    ],
    };

    return <div className="flex flex-col items-center w-full">
        <h3 className="text-bg font-bold">Item: <a href={`/study/${study.id}/item/${item.id}`} className="underline font-normal">{item.name}</a></h3>
        <div className="w-full">
            <Chart options={options} data={data} />
        </div>
    </div>
}