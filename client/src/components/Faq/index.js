import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemPanel,
    AccordionItemButton,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

const Faq = () => {
    const faqData = [
        {
            question: "What are the different types of courses?",
            answer: "Lobortis, nisl id! Facere voluptates veritatis interdum ac, occaecat orci vero consequat excepteur nibh aspernatur suspendisse? Mollitia facilisi autem magnam bibendum reiciendis."
        },
        {
            question: "What makes StepHub different from others?",
            answer: "Lobortis, nisl id! Facere voluptates veritatis interdum ac, occaecat orci vero consequat excepteur nibh aspernatur suspendisse? Mollitia facilisi autem magnam bibendum reiciendis."
        },
        {
            question: "What are the main features of StepHub?",
            answer: "Lobortis, nisl id! Facere voluptates veritatis interdum ac, occaecat orci vero consequat excepteur nibh aspernatur suspendisse? Mollitia facilisi autem magnam bibendum reiciendis."
        },
        {
            question: "How will StepHub help me in academics?",
            answer: "Lobortis, nisl id! Facere voluptates veritatis interdum ac, occaecat orci vero consequat excepteur nibh aspernatur suspendisse? Mollitia facilisi autem magnam bibendum reiciendis."
        },
    ];

    return (
        <div className="w-full my-8 dark:bg-gray-800 p-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Frequently Asked Questions</h2>
            <Accordion allowZeroExpanded>
                {faqData.map((faq, index) => (
                    <AccordionItem key={index} className="border-b border-gray-300 dark:border-gray-700">
                        <AccordionItemHeading>
                            <AccordionItemButton className="flex justify-between items-center w-full py-4 text-left text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 focus:outline-none transition-colors duration-200 border-l-2 border-indigo-500 pl-4">
                                {faq.question}
                                <span className="ml-2 text-indigo-500">
                                    {/* Chevron icon */}
                                    <svg className="w-5 h-5 transform transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel className="accordion-body">
                            <p className="text-gray-600 dark:text-gray-400 mt-2 px-2">{faq.answer}</p>
                        </AccordionItemPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default Faq;
