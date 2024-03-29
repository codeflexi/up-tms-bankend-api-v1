const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        unique: [true, 'name has to be unique'],
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

});

//Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    console.log('Calculating avg cost...'.blue);

    const obj = await this.aggregate(
        [
            {
                $match: { bootcamp: bootcampId }
            },
            {
                $group: {
                    _id: '$bootcamp',
                    averageCost: { $avg: '$tuition' }
                }

            }
        ]
    );
    //console.log(obj);
    try {
        // access Bootcamp model
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageCost: Math.ceil(obj[0].averageCost /10) * 10
        })

    } catch (err) {
        console.error(err);
    }
}

//Call get AverageCost after save
CourseSchema.post('save', function () {
    // run static model use this
this.constructor.getAverageCost(this.bootcamp);
});

//Call get AverageCost before remove
CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);

// const Genre = mongoose.model('Genre', genreSchema);
// exports.genreSchema = genreSchema;
// exports.Genre = Genre; 
// exports.validate = validateGenre;
