"use strict";

var DrugEntry = function (company, upic, drugName, drugCode, bestBefore) {
    this.company = company;
    this.upic = upic;
    this.drugName = drugName;
    this.drugCode = drugCode;
    this.bestBefore = bestBefore;
};

var PharmaVerify = function () {
    LocalContractStorage.defineMapProperty(this, "drugs", {
        parse: function (text) {
            var drugEntry = JSON.parse(text);

            return new DrugEntry(
                drugEntry.company,
                drugEntry.upic,
                drugEntry.drugName,
                drugEntry.drugCode,
                drugEntry.bestBefore
            );
        },
        stringify: function (drugEntry) {
            return JSON.stringify(drugEntry);
        }
    });
};

PharmaVerify.prototype = {
    init: function () {
        // no any actions required now
    },

    register: function (upic, drugName, drugCode, bestBefore) {
        if (!upic || !drugName || !drugCode || !bestBefore) {
            throw new Error("All the params should be non-empty");
        }

        if (this.drugs.get(upic)) {
            throw new Error("UPIC should be unique");
        }

        var company = Blockchain.transaction.from;
        upic = upic.trim();
        drugName = drugName.trim();
        drugCode = drugCode.trim();
        bestBefore = bestBefore.trim();

        var drugEntry = new DrugEntry(
            company,
            upic,
            drugName,
            drugCode,
            bestBefore
        );

        this.drugs.put(upic, drugEntry);
    },

    get: function (upic) {
        if (!upic) {
            throw new Error("UPIC can't be empty")
        }

        upic = upic.trim();

        return this.drugs.get(upic);
    }
};

module.exports = PharmaVerify;
