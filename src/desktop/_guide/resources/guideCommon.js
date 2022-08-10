function guideMenu() {
    const guideMenu = document.querySelectorAll('[data-ui-guide-menu]');

    const defaultMenuOpend = function (props) {
        const ariaExpanded = props.getAttribute('aria-expanded');
        ariaExpanded === "true" ? [
            (
                props.setAttribute('aria-expanded', true),
                props.classList.add('is-active')
            )
        ] : [
            (
                props.setAttribute('aria-expanded', false),
                props.classList.remove('is-active')
            )
        ];
    }

    const resultGuideUi = function (props) {
        const ariaExpanded = props.getAttribute('aria-expanded');
        ariaExpanded === "false" ? [
            (
                props.setAttribute('aria-expanded', true),
                props.classList.add('is-active')
            )
        ] : [
            (
                props.setAttribute('aria-expanded', false),
                props.classList.remove('is-active')
            )
        ];
    }

    const guideMenuClickable = function (ctr) {
        defaultMenuOpend(ctr);
        return function (e) {
            e.preventDefault();
            resultGuideUi(this);
        }
    };

    const guideMenuKeyUp = function (e) {
        var keyCode = e.which || e.keyCode;
        if (keyCode === 9) {
            resultGuideUi(this);
        }
    };

    [].forEach.call(guideMenu, function (item) {
        const menuItem = item.querySelectorAll("[aria-controls]");
        [].forEach.call(menuItem, function (ctr) {
            ctr.addEventListener('click', guideMenuClickable(ctr));
            ctr.addEventListener('keyup', guideMenuKeyUp);
        })
    })
}


function prismInit() {
    Prism.plugins.NormalizeWhitespace.setDefaults({
        'remove-trailing': true,
        'remove-indent': true,
        'left-trim': true,
        'right-trim': true,
        'break-lines': 0,
    });
    [].forEach.call(document.querySelectorAll('.ex-content'), function (el) {
        var htmlView = el.querySelector('.html-view');
        var htmlBtn = el.querySelector('.html-view-btn');

        if (htmlBtn) {
            htmlBtn.addEventListener('click', function (e) {
                pugBtn.classList.remove('active');
                htmlBtn.classList.add('active');
                pugView.style.display = 'none';
                htmlView.style.display = 'block';
            });
        }
    });
    [].forEach.call(document.querySelectorAll('.ex-code-block'), function (block) {
        var sourceString = block.innerHTML;
        sourceString = sourceString.replaceAll(' data-function-initialized="initialized"', '');
        if (block.classList.contains('render-html')) {
            block.classList.add('language-html');
            sourceString = Prism.highlight(sourceString, Prism.languages.html, 'html');
            block.innerHTML = sourceString;
        }
        if (block.classList.contains('render-js')) {
            block.classList.add('language-js');

            sourceString = window.js_beautify(sourceString, {
                indent_size: '2',
                indent_char: ' ',
                max_preserve_newlines: '5',
                preserve_newlines: true,
                keep_array_indentation: false,
                break_chained_methods: false,
                indent_scripts: 'normal',
                brace_style: 'collapse',
                space_before_conditional: true,
                unescape_strings: false,
                jslint_happy: false,
                end_with_newline: false,
                wrap_line_length: '0',
                indent_inner_html: false,
                comma_first: false,
                e4x: false,
                indent_empty_lines: false,
            });

            sourceString = Prism.highlight(sourceString, Prism.languages.js, 'javascript');
            block.innerHTML = sourceString;
        }
    });
    Prism.highlightAll();

}

document.addEventListener('DOMContentLoaded', function () {
    prismInit();
    guideMenu();

});