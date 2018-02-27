import { PlainTextParser } from ".";
import { readFileSync } from "fs";


describe("Plain Text Parser Test Suite", () => {

    const plainTextParser = new PlainTextParser();
    const stringContent = readFileSync(`${__dirname}/test.md`, "utf8");
    const expectedString = `# Library

## The Prestige

Director: Christopher Nolan

Writers:

- Jonathan Nolan
- Christopher Nolan

Year: 2006

Actors:

- Christian Bale
- Hugh Jackman
- Scarlett Johansson

Duration: 130 min

Watched: true

## Wind River

Director: Taylor Sheridan

Writers:

- Taylor Sheridan

Year: 2017

Actors:
- Jeremy Renner
- Elizabeth Olsen
- Julia Jones

Duration: 107 min

Watched: true
`;

    it("should return the same string as sent", async () => {
        const obj = await plainTextParser.parse(stringContent);
        expect(obj).toEqual(expectedString);
    });

});
