

type Special = {
    sentence: string,
    price: string | null
}


export type Menu = {
    specials: Special[],
    week: string | null, //since res.json() gives a string, and typescript type is just a label
    concerns: string | null,
    is_special: boolean
}
