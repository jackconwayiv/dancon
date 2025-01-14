from rest_framework import serializers

from api.models import Membership, Songbook
from api.serializers.membership import MembershipSerializer
from api.serializers.song_entry import SongEntrySerializer


class SongbookSerializer(serializers.ModelSerializer):
    total_songs = serializers.SerializerMethodField()
    current_song_position = serializers.SerializerMethodField()
    current_song_entry = serializers.SerializerMethodField()
    is_songbook_owner = serializers.SerializerMethodField()
    is_current_song_liked = serializers.SerializerMethodField()
    membership_set = serializers.SerializerMethodField()

    class Meta:
        model = Songbook
        fields = [
            "session_key",
            "max_active_songs",
            "title",
            "is_noodle_mode",
            "total_songs",
            "current_song_position",
            "current_song_entry",
            "id",
            "current_song_timestamp",
            "is_songbook_owner",
            "is_current_song_liked",
            "membership_set",
        ]

        extra_kwargs = {
            "session_key": {"read_only": True},
            "is_liked": {"read_only": True},
            "membership_set": {"read_only": True},
        }

    def get_membership_set(self, obj):
        request = self.context.get("request")
        if request is None:
            return None

        members = list(obj.membership_set.all())
        if not self._get_is_user_songbook_owner(members, request):
            members = [
                member for member in members if member.user.id == request.user.id
            ]
        return MembershipSerializer(members, many=True).data

    def _get_is_user_songbook_owner(self, members, req):
        membership = [member for member in members if member.user.id == req.user.id]
        if len(membership) == 0:
            return False

        return membership[0].type == Membership.MemberType.OWNER.value

    def get_total_songs(self, obj):
        return obj.get_total_song_count()

    def get_current_song_position(self, obj):
        return obj.get_current_song_position()

    def get_current_song_entry(self, obj):
        song_entry = obj.get_current_song_entry()
        if song_entry is None:
            return None
        return SongEntrySerializer(song_entry).data

    def get_is_songbook_owner(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        membership = obj.membership_set.get(user=user)
        return membership.type == Membership.MemberType.OWNER.value

    def get_is_current_song_liked(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user

        song_entry = obj.get_current_song_entry()
        if song_entry is None or user is None:
            return False

        return song_entry.song.likes.filter(pk=user.pk).exists()


class SongbookListSerializer(serializers.ModelSerializer):
    current_song_timestamp = serializers.DateTimeField(read_only=False, required=False)
    total_songs = serializers.SerializerMethodField()
    is_songbook_owner = serializers.SerializerMethodField()
    membership_set = serializers.SerializerMethodField()

    class Meta:
        model = Songbook
        fields = [
            "session_key",
            "max_active_songs",
            "title",
            "is_noodle_mode",
            "current_song_timestamp",
            "created_at",
            "updated_at",
            "total_songs",
            "is_songbook_owner",
            "membership_set",
        ]

        extra_kwargs = {"session_key": {"read_only": True}}

    def get_total_songs(self, obj):
        return obj.get_total_song_count()

    def _get_is_user_songbook_owner(self, members, req):
        membership = [member for member in members if member.user.id == req.user.id]
        if len(membership) == 0:
            return False

        return membership[0].type == Membership.MemberType.OWNER.value

    def get_membership_set(self, obj):
        request = self.context.get("request")
        if request is None:
            return None

        members = list(obj.membership_set.all())
        if not self._get_is_user_songbook_owner(members, request):
            members = [
                member for member in members if member.user.id == request.user.id
            ]
        return MembershipSerializer(members, many=True).data

    def get_is_songbook_owner(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        membership_list = [
            membership
            for membership in obj.membership_set.all()
            if membership.user == user
        ]

        if len(membership_list) != 1:
            return False
        return membership_list[0].type == Membership.MemberType.OWNER.value


class SongbookDetailSerializer(serializers.ModelSerializer):
    song_entries = SongEntrySerializer(many=True)

    class Meta:
        model = Songbook
        fields = [
            "session_key",
            "max_active_songs",
            "title",
            "is_noodle_mode",
            "song_entries",
            "current_song_timestamp",
        ]

        extra_kwargs = {"session_key": {"read_only": True}}
