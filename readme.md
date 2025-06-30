# Slack richtext to mrkdwn

Allows you to convert a Slack `rich_text` block to a `section` block.

## Installation and Usage

Install the npm module `slack-richtext-to-mrkdwn` by running:

```sh
> npm install slack-richtext-to-mrkdwn
```

Import and use function where needed in your code:

```js
import slackRichTextToMrkdwn from 'slack-richtext-to-mrkdwn';

const nkotb = slackRichTextToMrkdwn(basicbold)

```


### Example

The following example is a rich_text block:
```js

const basicbold = [
  {
    "type": "rich_text",
    "elements": [
      {
        "type": "rich_text_section",
        "elements": [
          {
            "type": "text",
            "text": "Hello there, "
          },
          {
            "type": "text",
            "text": "I am a bold rich text block!",
            "style": {
              "bold": true
          }
          }
        ]
      }
    ]
  }
]
```

You can convert this into a section block with the following (result shown as a comment):

```js
const nkotb = slackRichTextToMrkdwn(basicbold)



// result:
//
// {
//   sectionBlock: [ { type: 'section', text: [Object] } ],
//   mrkdwnText: 'Hello there, *I am a bold rich text block!*'
// }
```
Using this result, you can now get the result as a section or just the `mrkdwn` text.  Since it returns a JSON, the results can be accessed using dot notation.

The **section block** can be accessed using `.sectionBlock` and the **mrkdwn** text can be accessed using `.mrkdwnText`.  

```js
console.log (nkotb.sectionBlock)

// result: 
// [
//   {
//     type: 'section',
//     text: {
//       type: 'mrkdwn',
//       text: 'Hello there, *I am a bold rich text block!*'
//     }
//   }
// ]

console.log (nkotb.mrkdwnText)

// result: 
// Hello there, *I am a bold rich text block!*
```

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)