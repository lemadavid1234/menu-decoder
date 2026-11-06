

type Special = {
    sentence: string,
    price: string | null
}


export type Menu = {
    specials: Special[],
    day: string | null, //since res.json() gives a string, and typescript type is just a label
    concerns: string | null,
    is_special: boolean
}


export type ConfirmedMenu = {
    specials: Special[],
    day: string | null
}


export type ExplainedSpecial = {
    sentence: string
    price: string | null
    position: number

    possible_ingredients: string[]
    dietary_restrictions: string[]
    allergens: string[]
    suggested_wine_pairing: string[]
    description: string
    origin: string | null
    pronunciation: string
}

export type ExplainedMenu = {
    day: string | null
    specials: ExplainedSpecial[]
}