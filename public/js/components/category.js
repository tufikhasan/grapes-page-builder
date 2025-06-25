export default (editor) =>  {
    editor.DomComponents.addType("category-component", {
        model: {
            defaults: {
                components: `
                    <section>
                        <h2>Swiper Slider</h2>
                        <div class="row">
                            <!-- DYNAMIC_PART_START:components.category count=4 filter=latest userId=123 -->
                            <div class="swiper">
                                <div class="swiper-wrapper">
                                        <div class="swiper-slide">
                                            <span>Item 01</span>
                                        </div>
                                        <div class="swiper-slide">
                                            <span>Item 02</span>
                                        </div>
                                        <div class="swiper-slide">
                                            <span>Item 03</span>
                                        </div>
                                        <div class="swiper-slide">
                                            <span>Item 04</span>
                                        </div>
                                </div>
                            </div>
                            <div>
                                <button class="button-prev">
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 7L1 7M1 7L7 1M1 7L7 13" stroke="#161439" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                                <button class="button-next">
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 7L15 7M15 7L9 1M15 7L9 13" stroke="#161439" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <!-- DYNAMIC_PART_END -->
                        </div>
                    </section>`,
                script: function () {
                    var categoriesSwiper = new Swiper(".swiper", {
                        // Optional parameters
                        slidesPerView: 1,
                        loop: true,
                        // Navigation arrows
                        navigation: {
                            nextEl: ".button-next",
                            prevEl: ".button-prev",
                        },
                    });
                },
            },
            init() {
                const wrapper = this;
                const disableEditExcept = (comp, isRoot = false) => {
                    const tag = comp.get("tagName")?.toUpperCase();
                    const isAllowed = ["H5", "H2"].includes(tag);

                    comp.set({
                        editable: isAllowed,
                        draggable: isRoot, //allow root to be draggable
                        droppable: false,
                        copyable: false,
                        selectable: isAllowed || isRoot, // allow root and allow tags to be selectable
                    });

                    comp.components().forEach((child) =>
                        disableEditExcept(child, false)
                    );
                };

                disableEditExcept(wrapper, true); // Pass `true` for root
            },
        },
    });

    editor.BlockManager.add("category-section", {
        label: "Category Section",
        category: "Sections",
        content: {
            type: "category-component",
        },
        media: `<i class="fas fa-th-large"></i>`,
    });
}
