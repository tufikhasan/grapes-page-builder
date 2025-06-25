export default (editor) =>  {
    editor.DomComponents.addType("table-component", {
        model: {
            defaults: {
                name: "Table",
                droppable: false,
                draggable: true,
                selectable: true,
                highlightable: true,
                components: [
                    {
                        tagName: "table",
                        classes: ["table", "w-full", "border"],
                        components: [
                            {
                                tagName: "thead",
                                components: [
                                    {
                                        tagName: "tr",
                                        selectable: true,
                                        components: [
                                            {
                                                tagName: "th",
                                                components: [
                                                    {
                                                        type: "text",
                                                        content: "#",
                                                    },
                                                ],
                                            },
                                            {
                                                tagName: "th",
                                                components: [
                                                    {
                                                        type: "text",
                                                        content: "First",
                                                    },
                                                ],
                                            },
                                            {
                                                tagName: "th",
                                                components: [
                                                    {
                                                        type: "text",
                                                        content: "Last",
                                                    },
                                                ],
                                            },
                                            {
                                                tagName: "th",
                                                components: [
                                                    {
                                                        type: "text",
                                                        content: "Handle",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                tagName: "tbody",
                                components: [
                                    {
                                        tagName: "tr",
                                        selectable: true,
                                        components: [
                                            {
                                                tagName: "th",
                                                attributes: { scope: "row" },
                                                components: [
                                                    {
                                                        type: "text",
                                                        content: "1",
                                                    },
                                                ],
                                            },
                                            {
                                                tagName: "td",
                                                components: [
                                                    {
                                                        type: "text",
                                                        content: "Mark",
                                                    },
                                                ],
                                            },
                                            {
                                                tagName: "td",
                                                components: [
                                                    {
                                                        type: "text",
                                                        content: "Otto",
                                                    },
                                                ],
                                            },
                                            {
                                                tagName: "td",
                                                components: [
                                                    {
                                                        type: "text",
                                                        content: "@mdo",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    // Add more <tr> like above
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    });

    editor.BlockManager.add("table-section", {
        label: "Table",
        category: "Sections",
        content: {
            type: "table-component",
        },
        media: `<i class="fas fa-list"></i>`,
    });
}
