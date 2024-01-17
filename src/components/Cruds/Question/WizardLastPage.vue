<template>
    <div class="px-16">
        <v-row class="justify-content-center">
            <img src="../../../../src/assets/images/wizard_last_page_form.png" style="width: 333px;" />
        </v-row>
        <v-row class="justify-content-center">
            <h2 class="mt-6">{{ $t('form_submitted') }}</h2>
        </v-row>
        <v-row>
            <p class="mt-4 px-4 text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pulvinar nunc ornare mauris vulputate
                pellentesque erat nulla
                tortor arcu. Ultricies a eu sed egestas eu consectetur. Est vitae, egestas non nisl. Ut luctus praesent
                justo, uts.
            </p>
        </v-row>
        <v-divider></v-divider>
        <v-row class="mt-8 pb-13">
            <v-spacer></v-spacer>
            <v-tooltip :text="this.$t('return_to_dashboard')" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" variant="flat" color="blue" class="mr-1"  @click="godashboard()">{{
                        $t('return_to_dashboard') }}</v-btn>
                </template></v-tooltip>
            <v-tooltip :text="this.$t('view')" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" variant="flat" color="blue" class="ml-1" @click="viewwizard()">{{
                        $t('view') }}</v-btn>
                </template></v-tooltip>
            <v-spacer></v-spacer>
        </v-row>
    </div>
</template>
  
<script>

export default {
    components: {},
    data: () => ({

    }),
    computed: {
    },

    created() {

    },
    watch: {
    },
    methods: {
        viewwizard() {
            this.$router.push({
                name: "tradie_questions",
            });
        },
        godashboard() {
            this.$router.push({
                name: "dashboard",
            });
        },
    },
};
</script>
<style scoped>
.agreementspan {
    position: absolute;
    top: 16px;
    left: 40px;
    font-weight: 500;
    font-size: 15px;
}
</style> 