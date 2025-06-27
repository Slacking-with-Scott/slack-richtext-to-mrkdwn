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
// [
//   {
//     type: 'section',
//     text: {
//       type: 'mrkdwn',
//       text: 'Hello there, *I am a bold rich text block!*'
//     }
//   }
// ]
```
Using this, you can then use that as a section block in your code when posting a message or anywhere you need the block.

If you just need the `mrkdwn` text you can reference it in standard JSON format, which would be *`[variablename][0].text.text`*

```js
console.log (nkotb[0].text.text)

// result: 
//
//Hello there, *I am a bold rich text block!*
```

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)