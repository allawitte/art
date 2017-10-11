$(document).ready(function() {
    if ($(".ui-select").length)
        $(".ui-select").selectmenu();

    $('.go_back').on('click', function(e) {
        e.preventDefault();
        history.back();
    });

    function show_modal(target) {
        if ($(target).length) {
            $('body').append('<div class="modal_wrapper"></div>');
            $(target).addClass('open');
        }
    }

    function hide_modal(target) {
        if ($(target).length) {
            $('.modal_wrapper').remove('');
            $(target).removeClass('open');
        }
    }

    $('.confirm_bill_modal').on('click', function(e) {
        e.preventDefault();
        show_modal("#confirm_bill");
        var target_bill = Math.random().toString(36).slice(2, 2 + Math.max(1, Math.min(5, 10)));
        $(this).parents('td').attr("class", target_bill);
        $('#confirm_bill .confirm_this_bill').attr('data-target-bill', target_bill);
    });
    $('body').on('click', '.modal_wrapper', function(e) {
        e.preventDefault();
        hide_modal($('.modal.open'));
    });
    $('.close_modal').on('click', function(e) {
        e.preventDefault();
        hide_modal($(this).parents('.modal'));
    });

    $('.confirm_this_bill').on('click', function(e) {
        e.preventDefault();
        var now = new Date();
        var formated_date = now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
        $('.' + $(this).attr('data-target-bill')).html(formated_date);
        hide_modal($(this).parents('.modal'));
    });


    $('#new_user').submit(function(e) {
        e.preventDefault();
        var name = $('#new_user [name="name"]').val(),
            last_name = $('#new_user [name="last_name"]').val(),
            email = $('#new_user [name="email"]').val();
        //
        // $.ajax({
        // 	method: "POST",
        // 	url: "",
        // 	data: "",
        // }).done(function( response ) {
        // 	alert( response );
        $('.users_list').append('<li>< span >' + name + ' ' + last_name + '</span><a href="#" class="new_pass"> pass </a>' +
            '<a  href="#" class  = "remove_user"> & times;</a></li>');
        document.querySelector('#new_user').reset();
        // });
    });

    $('.users_list').on('click', '.remove_user', function(e) {
        e.preventDefault();
        show_modal("#remove_user");
        var target_user = Math.random().toString(36).slice(2, 2 + Math.max(1, Math.min(5, 10)));
        $(this).parents('li').attr("class", target_user);
        $('#remove_user .remove_this_user').attr('data-target-bill', target_user);
        $('#remove_user p').text("Пользователь " + $(this).parents('li').find('span').text() + " будет удален");
    });

    $('.remove_this_user').on('click', function(e) {
        e.preventDefault();
        $('.' + $(this).attr('data-target-bill')).remove();
        hide_modal($(this).parents('.modal'));
    });

    $('.users_list').on('click', '.new_pass', function(e) {
        e.preventDefault();
        show_modal("#new_email_sent");
    });

    $('#new_bill').submit(function(e) {
        e.preventDefault();
    });

    $('.generate_bill').on('click', function(e) {
        e.preventDefault();
        $(this).parent().next().removeClass('hidden');
        $(this).parent().remove();
    });

    $('.pay_button').on('click', function(e) {
        e.preventDefault();
        show_modal("#confirm_pay");
    });


    // 150817
    var calculate_cost_f = function() {
        var full_cost = parseInt($("#cost").val().replace(/\D+/g, "")),
            calculate_cost = 0;

        $('input.part_cost').each(function(i, el) {
            calculate_cost += parseInt($(el).val().replace(/\D+/g, ""));
        });
        calculate_cost = full_cost - calculate_cost;
        return calculate_cost;
    };

    $('.new_bill_form_wrapper').on('click', '.parted_link', function(e) {
        e.preventDefault();
        if (!$(this).hasClass('inactive')) {
            var bill_part = '<li class="bill_part"><p><input type="text" name = "part_name[]" class="part_name">' +
                '<input type="text" name="part_cost[] pattern=" ^ [0 - 9\s]+$"" class="part_cost">' +
                '<i class="fa fa-rub"> </i>' +
                '<span><a href="#" class="save_part form_serve"> Сохранить </a>' +
                '<a href="#" class="cancel_part form_serve"><img src="img/cancel.svg" alt="" class="img_close"/></a>' +
                '</span></p></li>';

            $('.bill_parts').append(bill_part);
            $(this).addClass('inactive');
        }

        $('.new_bill_form_wrapper .cancel_part').on('click', function(e) {
            $(this).parents('li').prev('li').find('.parted_link').removeClass('inactive').end().end().remove();
            var partCost = calculate_cost_f();
            var full_cost = parseInt($("#cost").val().replace(/\D+/g, ""));
            var cost = full_cost - partCost;
            if (!cost) {
                $('.calculate_cost_container span').empty();
            } else {
                $('.calculate_cost_container span').contents().filter(function() {
                    if (this.nodeType == Node.TEXT_NODE) {
                        this.textContent = (partCost).toLocaleString('ru') + ' ';
                    }
                });
            }
            if ($('.new_bill_form_wrapper ol').html() == '') {
                $('.parted_link').removeClass('inactive');
            }

        });


    });


    $('.bill_parts').on('change', '.part_cost', function(e) {
        var calculate_cost = 0,
            calculate_cost_container = $('.calculate_cost_container');

        calculate_cost = calculate_cost_f();

        if (calculate_cost >= 0) {
            calculate_cost_container.html('<span class="green">' + (calculate_cost).toLocaleString('ru') + '&emsp;<i class="fa fa-rub" aria-hidden="true"></i></span>');
        } else {
            calculate_cost_container.html('<span class="red">' + (calculate_cost).toLocaleString('ru') + '&emsp;<i class="fa fa-rub" aria-hidden="true"></i></span>');
        }
    });

    $('.bill_parts').on('click', '.save_part', function(e) {
        e.preventDefault();
        var part_container = $(this).closest('.bill_part'),
            part_name_input = part_container.find('.part_name'),
            part_cost_input = part_container.find('.part_cost'),
            save_part_link = $(this),
            calculate_cost = 0;

        part_container.find('p').addClass('saved_content');

        if (!save_part_link.hasClass('inactive')) {
            part_name_input.hide();
            part_name_input.after('<span class="part_name">' + part_name_input.val() + '</span');
            part_cost_input.hide();
            part_cost_input.after('<span class="part_cost">' + part_cost_input.val() + '</span');
            save_part_link.addClass('inactive');

            calculate_cost = calculate_cost_f();
            if (calculate_cost > 0) save_part_link.after('<a href="#" class="parted_link form_serve">+ строка</a>');
        }
    });

    $('#cost').on('keydown', function(e) {
        var values = '0123456789';
        var kode = e.key;
        console.log('kode', kode);
        if (kode && kode.length == 1 && !(kode >= 0 && kode < 10) && kode != '.') {
            e.preventDefault();
        }
    });
    $('#cost').blur(function() {
        if (this.value == 0) {
            show_modal('#cost_warning');
        }
    });


    $('.upload_area').on('dragover', function(e) {
        e.preventDefault();
    });

    var uploadArea = document.querySelector('.upload_area');
    var chooseFile = document.querySelector('#choose_file');
    if (uploadArea) {
        uploadArea.addEventListener('drop', dropHandler);
    }

    function dropHandler(e) {
        var files = e.dataTransfer.files;
        e.preventDefault();
        addFileNameToUploadArea(files[0]);
        chooseFile.files = files;
    }

    $('.upload_area').on('click', function() {
        $('#choose_file').click();
        $('#choose_file').on('change', function(e) {
            var file = e.target.files[0];
            addFileNameToUploadArea(file);
            var reader = new FileReader();
            reader.addEventListener('load', readerHandler);
            reader.readAsDataURL(file);

            function readerHandler() {
                var dataURL = reader.result;
                //console.log(dataURL);
            }
        })
    });
    var inputs = document.querySelectorAll('.letters_wrapper input[type=text], .letters_wrapper textarea, .req_wrapper input[type=text]');
    //var txtAreas = document.querySelectorAll('.letters_wrapper textarea');
    if (inputs.length) {

        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
            inputs[i].classList.add('disabled');
        }
    }


    function addFileNameToUploadArea(file) {
        $('.upload_area').text(file.name);
    }

    $('#upload').on('change', function(e) {
        if (e.target.checked) {
            $('.upload_area').addClass('open');
            $('.parted_link').addClass('inactive');
            $('.bill_parts').empty();
            $('.calculate_cost_container').empty();
        }
    });
    $('#generate').on('change', function(e) {
        $('.upload_area').removeClass('open');
        $('.parted_link').removeClass('inactive');
    });

    var checkBoxses = document.querySelectorAll('.for_checkbox input');
    if (checkBoxses.length) {
        for (var i = 0; i < checkBoxses.length; i++) {
            checkBoxses[i].addEventListener('click', handleUserRights);
        }
    }

    function handleUserRights(e) {

        e.preventDefault();
        var checkBox = e.target;
        var modal = document.querySelector('#give_user_rights');
        var category = document.querySelector('#give_user_rights #rights');
        var user = document.querySelector('#give_user_rights #name');
        var modalWrapper = document.createElement('div');
        var closeModal = document.querySelector('#give_user_rights .close_modal');
        var givePermissions = document.querySelector('#give_user_rights .give_permissions');

        closeModal.addEventListener('click', closeModalHandler);
        givePermissions.addEventListener('click', givePermissionsHandler);

        function givePermissionsHandler() {
            checkBox.checked = true;
            closeModalHandler();
        }

        function closeModalHandler() {
            modal.classList.remove('open');
            if (modalWrapper.parentNode && modalWrapper.parentNode.tagName == 'BODY') {
                document.body.removeChild(modalWrapper);
            }

        }

        modalWrapper.classList.add('modal_wrapper');
        var categories = {
            users: 'Пользователи',
            letters: 'Письма',
            requisites: 'Реквизиты'
        };

        category.textContent = categories[e.target.dataset.category];
        user.textContent = e.target.parentElement.parentElement.children[0].textContent;
        document.body.appendChild(modalWrapper);
        modal.classList.add('open');
    }

    var adminLetterEdits = document.querySelectorAll('.letters_wrapper a.edit');
    if (adminLetterEdits.length) {
        for (var i = 0; i < adminLetterEdits.length; i++) {
            adminLetterEdits[i].addEventListener('click', setControlsToEdit);
        }
    }

    function setControlsToEdit(e) {
        e.preventDefault();
        var self = e.target;
        var cancelLink = self.nextElementSibling;
        cancelLink.children[0].classList.add('open');
        self.classList.add('disabled_link');
        //self.removeEventListener('click', setControlsToEdit);
        cancelLink.addEventListener('click', cancelEdit);
        var currentBlockClass = self.dataset.name;
        document.querySelector('.' + currentBlockClass + ' + .button').classList.add('open');
        setDisabled(currentBlockClass, false)
    }

    function setDisabled(block, disable) {
        var inputs = document.querySelectorAll('.' + block + ' input[type=text], .' + block + ' textarea');
        if (inputs.length) {
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].disabled = disable;
                if (disable) {
                    inputs[i].classList.add('disabled');
                } else {
                    inputs[i].classList.remove('disabled');
                }
            }
        }
    }

    function cancelEdit(e) {
        e.preventDefault();
        this.children[0].classList.remove('open');
        this.previousElementSibling.classList.remove('disabled_link');
        var currentBlockClass = this.dataset.name;
        document.querySelector('.' + currentBlockClass + ' + .button').classList.remove('open');
        setDisabled(currentBlockClass, true)
    }

    var newBankCard = document.querySelector('.bank_cards .drag_new');
    var bankCardsContainer = document.querySelector('.bank_cards .cards_container');
    var reader = new FileReader();
    reader.addEventListener('load', readerNewCard);

    function readerNewCard() {
        bankCardsContainer.querySelector('img').src = reader.result;
        newBankCard.classList.add('plane');
        newBankCard.children[0].textContent = 'Сохранить';
        newBankCard.children[0].addEventListener('click', saveNewImg);

        function saveNewImg(e) {
            var current = e.target;
            current.textContent = 'Сохранено';
            current.classList.add('disabled_link');
            current.removeEventListener('click', saveNewImg);
        }
    }

    if (newBankCard) {
        newBankCard.addEventListener('drop', handleDropNewCard);
        newBankCard.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        newBankCard.addEventListener('click', addNewBankCard);

    }

    function addNewBankCard(e) {
        var inputFile;
        var current = e.target;
        if (current.tagName == 'A') {
            inputFile = current.nextElementSibling;
        }
        if (current.tagName == 'DIV') {
            inputFile = current.children[1];
        }
        if (inputFile) {
            inputFile.click();
            inputFile.addEventListener('change', uploadImg);
            newBankCard.removeEventListener('click', addNewBankCard);
        }

        function uploadImg(e) {
            var file = e.target.files[0];
            reader.readAsDataURL(file);
        }

    }

    function handleDropNewCard(e) {
        var files = e.dataTransfer.files;
        e.preventDefault();
        reader.readAsDataURL(files[0]);

    }

    var letterContent = document.querySelectorAll('.set_invoice .duplication p:not(.subject)');
    var modal = document.getElementById('letter_preview');
    var viewBtn = document.getElementById('view');
    if (viewBtn) {
        if (letterContent) {
            viewBtn.addEventListener('click', showLetterModal);
        }
    }

    function showLetterModal(e) {
        e.preventDefault();

        if (!modal.querySelector('.letter_content_modal')) {
            var div = document.createElement('div');
            div.classList.add('letter_content_modal');
            for (var i = 0; i < letterContent.length; i++) {
                var p = letterContent[i].cloneNode(true);
                div.appendChild(p);
            }
            var beforeElement = document.querySelector('.modal .bank_cards');
            modal.insertBefore(div, beforeElement);
        }

        var modalWrap = document.createElement('div');
        modal.classList.add('open');
        modalWrap.classList.add('modal_wrapper');
        document.body.appendChild(modalWrap);
    }

    var reqEdits = document.querySelectorAll('.req_wrapper .edit');
    if (reqEdits.length) {
        for (var i = 0; i < reqEdits.length; i++) {
            reqEdits[i].addEventListener('click', enableReq);
        }
    }

    function enableReq(e) {
        e.preventDefault();
        var current = e.target;
        var inputs = document.querySelectorAll('.req_wrapper #' + current.dataset.name + ' input[type=text]');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = false;
            inputs[i].classList.remove('disabled');
        }
        var cancelBtn = current.nextElementSibling;
        cancelBtn.children[0].classList.add('open');
        cancelBtn.addEventListener('click', disableReq);
        current.classList.add('disabled_link');
        document.querySelector('.req_wrapper #' + current.dataset.name + ' .button').classList.add('open');
    }

    function disableReq(e) {
        e.preventDefault();
        var inputs = document.querySelectorAll('.req_wrapper #' + this.dataset.name + ' input[type=text]');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
            inputs[i].classList.add('disabled');
        }
        this.children[0].classList.remove('open');
        this.previousElementSibling.classList.remove('disabled_link');
        document.querySelector('.req_wrapper #' + this.dataset.name + ' .button').classList.remove('open');
    }

    var tableContainerSet = document.querySelectorAll('.all_bills .bills_table tr');
    var tableStructure = [];

    if (tableContainerSet.length) {
        var sortBtns = tableContainerSet[0].querySelectorAll('a.sort');
        if (sortBtns.length) {
            for (var i = 0; i < sortBtns.length; i++) {
                sortBtns[i].addEventListener('click', sortTable, true);
            }
        }
        var i = tableContainerSet[0].children[0].querySelector('a.sort') ? 1 : 0;

        for (i; i < tableContainerSet.length; i++) {
            var trContent = tableContainerSet[i].children;
            tableStructure.push({
                id: trContent[0].cloneNode(true),
                name: trContent[1].cloneNode(true),
                amount: trContent[2].cloneNode(true),
                title: trContent[3].cloneNode(true),
                responsible: trContent[4].cloneNode(true),
                sent: trContent[5].cloneNode(true),
                paid: trContent[6].cloneNode(true),
                class: tableContainerSet[i].className
            });
        }

    }

    function asc(field, direction) {

        return function(bill1, bill2) {
            var value1, value2;

            if (field == 'id' || field == 'amount') {
                value1 = +bill1[field].textContent.replace(/ +/g, '');
                value2 = +bill2[field].textContent.replace(/ +/g, '');
                if (direction == 'asc') {
                    return value1 - value2;
                } else {
                    return value2 - value1;
                }

            }
            if (field == 'name' || field == 'title' || field == 'responsible') {
                value1 = bill1[field].textContent;
                value2 = bill2[field].textContent;
                if (direction == 'asc') {
                    return value1 > value2
                } else {
                    return value2 > value1
                }

            }

        }
    }

    function sortTable(e) {
        e.preventDefault();
        var srt = this.dataset.name;
        var dir;
        var direction = this.querySelector('.fa-sort-asc');
        if (direction) {
            dir = 'asc';
            direction.className = 'fa fa-sort-desc';
        }
        if (!direction) {
            direction = this.querySelector('.fa-sort-desc');
            dir = 'desc';
            direction.className = 'fa fa-sort-asc';
        }
        tableStructure.sort(asc(srt, dir));
        resetTable(tableStructure)
    }

});

function resetTable(tableStructure) {
    var table = document.querySelector('.bills_table');
    var elems = table.children;
    for (var i = 1; i < elems.length; i++) {
        table.removeChild(elems[i]);
    }
    var tbody = document.createElement('tbody');
    tableStructure.forEach(function(item) {
        var tr = document.createElement('tr');
        tr.className = item.class;
        tr.appendChild(item.id);
        tr.appendChild(item.name);
        tr.appendChild(item.amount);
        tr.appendChild(item.title);
        tr.appendChild(item.responsible);
        tr.appendChild(item.sent);
        tr.appendChild(item.paid);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}

var txtAreas = document.querySelectorAll('textarea');
if (txtAreas) {
    for (var i = 0; i < txtAreas.length; i++) {
        var txt = txtAreas[i].textContent;
        txtAreas[i].textContent = txt.replace(/  +/g, '');

        var height = txtAreas[i].offsetHeight;
        console.log(height)
    }
}

var tableAdds = {
    responsible: 'ответственный - ',
    sent: 'отправлен: ',
    paid: 'оплачен: '
};
var added = false;

function addTextToTable() {
    if (window.innerWidth <= 1000) {

        var addCells = document.querySelectorAll('.bills_table.all_bills td');
        if (!added) {
            if (addCells) {
                for (var i = 0; i < addCells.length; i++) {
                    var className = addCells[i].className.match(/responsible|sent|paid/);
                    if (className) {
                        var tdContent = addCells[i].innerHTML;
                        if (tdContent) {
                            addCells[i].innerHTML = '<span class="mobile">' + tableAdds[className] + '</span>' + tdContent;
                        }

                    }
                }
                added = true;
            }
        }

    } else {
        var mobileSpans = document.querySelectorAll('.bills_table.all_bills td .mobile');
        for (var i = 0; i < mobileSpans.length; i++) {
            var parent = mobileSpans[i].parentNode;
            parent.removeChild(mobileSpans[i]);
        }
        added = false;
    }

}
addTextToTable();
window.addEventListener('resize', addTextToTable);