<template>
    <div>
        <v-row>
        <v-col md="12">
          <v-alert icon="mdi-message-alert" class="erroralert" v-model="have_error" variant="tonal" closable
          close-label="Close Alert" color="error" title="Error Message">
          Please Insert Country name in arabic language also !
        </v-alert>
        <v-alert icon="mdi-check-bold" class="erroralert" v-model="alert_message" variant="tonal" closable
            close-label="Close Alert" color="success" title="Uploaded Succesfully">
            3 rows Inserted !
          </v-alert>
        </v-col>
      </v-row>
      
        <v-row>
            <v-col md="9" class="align-self-center pl-6">
                <div class='fileinputdiv' style="padding-top: 13px;">
                    <input type="file" @change="handleFileUpload" id="fileselector" ref="file"
                        accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                </div>
                <div style="position: relative;">
                    <v-btn v-if="filename == ''" block class="py-5" @click="selectFile">{{
                        $t('click_here_to_file_upload') }}</v-btn>
                    <v-btn v-else disabled="true" block class="py-5" style="background: white, !important;">{{ filename }}
                    </v-btn>
                    <v-tooltip :text="this.$t('cancel')" location="bottom">
                        <template v-slot:activator="{ props }">
                            <v-btn v-if="filename != ''" @click="clearFile" class="ma-1 closebtn" color="error"
                                size="xx-small" v-bind="props" icon="mdi-close"></v-btn>
                        </template>
                    </v-tooltip>
                </div>
            </v-col>
            <v-col md="1">
                <a v-bind:href="'@/assets/files/CountryStateCity.xlsx'" download>
                    <v-tooltip text="Download Template" location="bottom">
                        <template v-slot:activator="{ props }">
                            <img style="height: 70px;" v-bind="props" src="../../../public/img/xlsxicon.png" alt />
                        </template>
                    </v-tooltip>
                </a>
            </v-col>
            <v-col md="2" class="align-self-center">
                <v-btn color="primary" v-if="filename" @click="uploadexcell">{{ $t('upload') }}</v-btn>
            </v-col>
        </v-row>
    </div>
</template>
  
<script>
import * as XLSX from 'xlsx';
export default {
    data() {
        return {
            tableData: [],
            filename: '',
            excel_json: []
        };
    },
    methods: {
        selectFile() {
            document.getElementById("fileselector").click();
        },
        clearFile() {
            this.filename = '';
            this.tableData = [];
            this.$refs.file.value = null;
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.filename = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                this.tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            };
            reader.readAsArrayBuffer(file);
        },
        uploadexcell() {
            this.$emit("ExcellRecieved", this.tableData)
        },
    }
};
</script>
<style scoped>
.fileinputdiv {
    display: none;
}

.closebtn {
    position: absolute;
    right: 5px;
    top: 4px;
    font-size: 16px;
}
</style>