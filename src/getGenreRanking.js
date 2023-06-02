import BIG_FIVE_TRAITS from "./BigFive"

/*
Rank different film genres according to the user's Big Five personality test scores   
*/


/*
While trying to figure out how to determine someone's preferred film genre based on their personality, I found a research paper by Renfrow et al. (see Acknowledgements file [TODO: create that file...]), which indicates that the Big Five personality traits are--to varying extents--correlated with preferences for certain categories or "factors" of entertainment.
TODO: write morere..eljweoirgjwrpgerpit
*/

/*
Map each of the five Factors to a list of film genres recognized by TMDB
Once the user's preferred Factor is determined, the program will search TMDB for movies in any of the genres in the corresponding list

(Note: Some of the TMDB-recognized film genres are not recognized in Rentfrow et al., so these genres were categorized here according to how Rentfrow et al. categorized similar genres)
*/
const FACTOR_GENRES = {
    Communal: ["romance", "family", "drama", "music", "comedy"],
    Aesthetic: ["music", "documentary", "history"],
    Dark: ["horror"],
    Thrilling: ["action", "science fiction", "western", "war", "thriller", "crime", "mystery", "adventure", "fantasy"],
    Cerebral: ["documentary"]

}

// adventure, fantasy, animation, comedy, history, thriller, crime, mystery, tv movie

// adventure, fantasy, animation, dsrama, horror, action, comedy, history, western, thriller, crime, documentary, science fiction, mystery, music, romance, family, war, tv movie

/*
"Personality Correlates of Five Entertainment-Preference Factors" from Rentfrow et al., Table 4

If I understand correctly, correlants fall in the range [-1, 1], and the higher the correlant between a personality trait and a preference factor, the more likely it is that someone with that personality trait will exhibit that preference.

For example, the paper says, "the Communal factor was positively related to [...] facets of Agreeableness," and that "individuals who prefer the Communal [type of] entertainment [tend to be] pleasant [i.e. agreeable]"

*/

const CORRELANTS_RENFROW = new Map([
    //correlants per trait are in this order: Communal, Aesthetic, Dark, Thrilling, Cerebral
    [BIG_FIVE_TRAITS.extraversion, [0.095, 0.07, 0.11, -0.04, 0.125]],
    [BIG_FIVE_TRAITS.agreeableness, [0.375, 0.18, -0.17, -0.015, -0.005]],
    [BIG_FIVE_TRAITS.conscientiousness, [0.075, 0, -0.165, 0.02, 0.125]],
    [BIG_FIVE_TRAITS.emotionalStability, [-0.115, 0.045, 0.015, 0.05, 0.1]],
    [BIG_FIVE_TRAITS.opennessToExperiences, [-0.17, 0.38, 0.165, -0.04, 0.17]],
]);

function getPreferredGenres(userPersonality) {
    let factorPoints = [0,0,0,0,0];
    let factorNames = ["Communal", "Aesthetic", "Dark", "Thrilling", "Cerebral"];

    //TODO: find better way to handle looping over traits?

    BIG_FIVE_TRAITS.traits.forEach((trait) => {
        console.log(trait);
        CORRELANTS_RENFROW.get(trait).forEach((correlant, i) => {
            console.log(correlant);
            console.log(userPersonality[trait]);
            factorPoints[i] += correlant * userPersonality[trait];
        })
    });

    console.log(factorPoints);

    // Find the factor with the highest score, i.e. the factor which the user is most likely to prefer
    let m = 0;
    factorPoints.forEach((p, i) => {
        if(p > factorPoints[m])
            m = i;
    });
    return {
        factor: factorNames[m],
        genres: FACTOR_GENRES[factorNames[m]]
    };

}

const AVG_GENRE_STATS_NALMPANTIS = {
    action: []
}

export default getPreferredGenres;