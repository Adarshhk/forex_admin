
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import Checkbox from '@/components/Checkbox.vue';
import ButtonSwitch from '@/components/ButtonSwitch.vue';
import Dropdown from '@/components/Dropdown.vue';

export default (app) => {

    app.component('ArrowIcon', ArrowIcon)
    app.component('Checkbox', Checkbox)
    app.component('ButtonSwitch', ButtonSwitch)
    app.component('Dropdown', Dropdown)
}