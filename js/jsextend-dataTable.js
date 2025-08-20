class DataTable {
    constructor(dataSource, caption, allowSorting, allowFilter){
        this.dataSource = dataSource;
        this.caption = caption;
        this.allowSorting = (allowSorting != undefined) ? allowSorting : true;
        this.allowFilter = (allowFilter != undefined) ? allowFilter : true;
    }

    genTableHtml(){
        let html = '<table class="table caption-top">';
        html += this.genCaptionHtml();
        html += this.genTheadHtml();
        html += this.genTbodyHtml();
        html += '</table>'
        return html;
    }

    genCaptionHtml(){
        let html = '<caption>';

        if(this.caption)
            html += this.caption;
        html += '&nbsp;<span class="badge bg-secondary rounded-pill table-count">'+this.dataSource.length+'</span>';
        html += '</caption>'
        return html;
    }

    genTheadHtml(){
        let html = '<thead>';
        let item = this.dataSource[0];
        let tblEl = 'this.parentElement.parentElement.parentElement.parentElement';

        // Header row
        html += '<tr>';
        if(this.allowSorting){
            let i = 0;
            for(let c in item){
                html += '<th class="th-'+c+' th-'+i+'"><a href="javascript:void" onclick="'+tblEl+'.sort(\''+c+'\')">' + c + '</a></th>';
                i++;
            }
        }
        else{
            let i = 0;
            for(let c in item){
                html += '<th class="th-'+c+' th-'+i+'">'+c+'</th>';
                i++;
            }
        }
        html += '</tr>';

        // Filter row
        if(this.allowFilter){
            html += '<tr>';
            for(let c in item){
                html += '<th><input type="text" class="form-control form-control-sm" onkeyup="'+tblEl+'.filter(this.value, \''+c+'\', event);" /></th>';
            }
            html += '</tr>';
        }

        html += '</thead>';

        return html;
    }

    genTbodyHtml(){
        let html = '<tbody>';
        for(let r=0; r<this.dataSource.length; r++){
            let item = this.dataSource[r];

            html += '<tr>';
            let i=0;
            for(let c in item){
                html += '<td class="td-' + c + ' td-'+i+'">' + item[c] + '</td>';
                i++;
            }
            html += '</tr>';
        }
        html += '</tbody>';

        return html;
    }

    genTfootHtml(){

    }
}

HTMLTableElement.prototype.genDataTable = function(dataSource, caption){
    const dt = new DataTable(dataSource, caption);
    let html = '';

    html = dt.genCaptionHtml();
    if(caption)
        this.dataset.caption = caption;
    html += dt.genTheadHtml();
    html += dt.genTbodyHtml();

    this.dataSource = dataSource;
    //this.oldDataSource = dataSource;

    if(!this.dataset.direction)
        this.dataset.direction = 'asc';
    this.innerHTML = html;
}

HTMLTableElement.prototype.genTbody = function(dataSource){
    let dt = new DataTable(dataSource);
    this.querySelector('tbody').innerHTML = dt.genTbodyHtml();
}


HTMLTableElement.prototype.sort = function(columnName){
    let dir = this.dataset.direction;

    let ds;
    if(dir == 'asc')
    {       
        ds = this.dataSource.sort((a,b) => {
            let valA = a[columnName];
            let valB = b[columnName];

            if(typeof valA == 'number'){
                return valB - valA;
            }
            else{
                valA = valA.toString().toUpperCase();
                valB = valB.toString().toUpperCase();

                if(valA > valB)
                    return -1;
                else if(valA < valB)
                    return 1;
                else
                    return 0;
            }
        });
        this.dataset.direction = 'desc';
    }
    else{
        ds = this.dataSource.sort((a,b) => {
            let valA = a[columnName];
            let valB = b[columnName];

            if(typeof a[columnName] == 'number'){
                return valA - valB;
            }
            else{
                valA = valA.toString().toUpperCase();
                valB = valB.toString().toUpperCase();

                if(valA < valB)
                    return -1;
                else if(valA > valB)
                    return 1;
                else
                    return 0;
            }
        });
        this.dataset.direction = 'asc';
    }

    this.genTbody(ds);
}

HTMLTableElement.prototype.filter = function(value, columnName, ev){
    const cls = this;
    let nVal = value.trim().toLowerCase().replace(' ', '');

    if(ev == undefined || ev.keyCode === 13){
        if (nVal != '') {
            this.querySelectorAll('tbody tr.d-none').forEach(tr => {
                tr.classList.remove('d-none');
            });
            
            let count = 0;
            const trs = this.querySelectorAll('tbody tr');

            for(let r=0; r<trs.length; r++){
                let tr = trs[r];
                let result = false;

                if(columnName){
                    // search one column
                    let td = tr.querySelector('.td-'+columnName);
                    let text = td.textContent.toString().trim().toLowerCase();

                    if(!isNaN(parseFloat(text)) && isFinite(text)){
                        // search by number
                        if(nVal.indexOf('>=') > -1)
                            result = text >= nVal.replace('>=', '');
                        else if(nVal.indexOf('>') > -1)
                            result = text > nVal.replace('>', '');
                        else if(nVal.indexOf('<=') > -1)
                            result = text <= nVal.replace('<=', '');
                        else if(nVal.indexOf('<') > -1)
                            result = text < nVal.replace('<', '');
                        else if(nVal.indexOf('=') > -1)
                            result = text == nVal;
                        else
                            result = text == nVal;
                    }
                    else{
                        // search by text
                        result = text.indexOf(nVal) > -1;
                    }
                }
                else{
                    // search all columns
                    const tds = tr.querySelectorAll('td');
                    for(let c=0; c<tds.length; c++){
                        let td = tds[c];
                        let text = td.textContent.toString().trim().toLowerCase();

                        if(!isNaN(parseFloat(text)) && isFinite(text)){
                            // search by number
                            if(nVal.indexOf('>=') > -1)
                                result = text >= nVal.replace('>=', '');
                            else if(nVal.indexOf('>') > -1)
                                result = text > nVal.replace('>', '');
                            else if(nVal.indexOf('<=') > -1)
                                result = text <= nVal.replace('<=', '');
                            else if(nVal.indexOf('<') > -1)
                                result = text < nVal.replace('<', '');
                            else if(nVal.indexOf('=') > -1)
                                result = text == nVal;
                            else
                                result = text == nVal;
                        }
                        else{
                            // search by text
                            result = text.indexOf(nVal) > -1;
                        }

                        if(result)
                            break;
                    }
                }

                // hide row
                if(result){
                    count++;
                }
                else{
                    if(!tr.classList.contains('d-none'))
                        tr.classList.add('d-none');
                }

                // Update table count
                this.querySelector('.table-count').innerHTML = count;
            }
        }
        else{
            // show all
            this.querySelectorAll('tbody tr.d-none').forEach(tr => {
                tr.classList.remove('d-none');
            });
            // Update table count
            this.querySelector('.table-count').innerHTML = this.dataSource.length;
        }
    }
}