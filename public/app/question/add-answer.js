(function() {
    'use strict';
    $(document).ready(function() {
        $(document).on('click', '#question-container #answer-add-button', function(ev) {
            var $target = $(ev.target),
                $listItem = $('<li/>'),
                $paragraph = $('<p/>'),
                $answersList = $('#answers-container'),
                $input = $('<input/>'),
                $inputRadio = $('<input/>'),
                $label = $('<label/>');
           
            var answersCount = $answersList.children().length;
            $input.attr({
               'class': 'form-control', 
               'id': 'inputAnswer-' + (answersCount + 1),
               'ng-model': 'question.answers[' + answersCount + '].text',
               'name': 'answer' + (answersCount + 1),
               'placeholder': 'Answer',
               'type': 'text',
                'pattern': '.{2,}'
            });
            
            $inputRadio.attr({
                'type': 'radio',
                'name': 'index',
                'ng-model': 'question.index'
            });
            
            $label.attr({
                'class': 'answer-label' 
            }).html('Mark answer as correct');
            
            $paragraph.append($inputRadio);
            $paragraph.append($label);
            $paragraph.append($input);
            $listItem.append($paragraph);
            $answersList.append($paragraph);
        });
    });
} ());